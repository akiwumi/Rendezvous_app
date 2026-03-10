import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { postService, eventService, announcementService } from '../services/localDataService';
import './CreatePostPage.css';

type PostType = 'regular' | 'event' | 'announcement';
type PaymentType = 'one-time' | 'donation' | 'free';
type Currency = 'GBP' | 'EUR' | 'USD';

const EMOJIS = ['😊', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🎯', '🌟', '💪', '🎊', '🙌', '👏', '🥳', '🎈', '🍕', '🥂', '🌴', '🎸', '⛵'];

const CURRENCY_SYMBOLS: Record<Currency, string> = { GBP: '£', EUR: '€', USD: '$' };

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { currentUser, setPosts, setEvents, setAnnouncements } = useApp();

  // Form state
  const [postType, setPostType] = useState<PostType>('regular');
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');

  // Event / announcement fields
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');

  // Payment
  const [isPaid, setIsPaid] = useState(false);
  const [ticketPrice, setTicketPrice] = useState('');
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [paymentType, setPaymentType] = useState<PaymentType>('one-time');

  // UI
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');

  const effectiveImage = imageMode === 'url' ? imageUrl || null : image;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const insertEmoji = (emoji: string) => setContent(prev => prev + emoji);

  const buildEventDate = (): Date | undefined => {
    if (!eventDate) return undefined;
    return new Date(`${eventDate}T${eventTime || '00:00'}`);
  };

  const buildDeadline = (): Date | undefined => {
    if (!deadline) return undefined;
    return new Date(`${deadline}T${deadlineTime || '00:00'}`);
  };

  const handlePublish = async () => {
    if (!currentUser) return;
    if (!content.trim()) { setError('Post content is required.'); return; }
    if ((postType === 'event' || postType === 'announcement') && !eventDate) {
      setError('Please set a date for this event.'); return;
    }
    setError('');
    setPublishing(true);

    try {
      const postData = {
        id: `post-${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.fullName,
        authorImage: currentUser.profileImage,
        headline: headline.trim() || undefined,
        content: content.trim(),
        image: effectiveImage || undefined,
        postType,
        location: location.trim() || undefined,
        eventDate: buildEventDate(),
        deadline: buildDeadline(),
        isPaid: postType !== 'regular' ? isPaid : false,
        ticketPrice: isPaid && ticketPrice ? Math.round(parseFloat(ticketPrice) * 100) : undefined,
        ticketCurrency: isPaid ? currency : undefined,
        paymentType: isPaid ? paymentType : undefined,
        interestedUsers: [],
        createdAt: new Date(),
        likes: [],
        comments: [],
      };

      await postService.createPost(postData as any);

      // Also create an event record if it's an event post
      if (postType === 'event' && buildEventDate()) {
        await eventService.createEvent({
          id: `evt-${Date.now()}`,
          title: headline || content.substring(0, 50),
          description: content,
          image: effectiveImage || undefined,
          date: buildEventDate()!,
          location: location || undefined,
          attendees: [],
          createdBy: currentUser.id,
        });
        const updatedEvents = await eventService.getEvents();
        setEvents(updatedEvents);
      }

      // Also create an announcement record if it's an announcement post
      if (postType === 'announcement') {
        await announcementService.createAnnouncement({
          id: `ann-${Date.now()}`,
          title: headline || content.substring(0, 60),
          content: content,
          image: effectiveImage || undefined,
          date: buildEventDate() || new Date(),
          type: 'event',
        });
        const updatedAnn = await announcementService.getAnnouncements();
        setAnnouncements(updatedAnn);
      }

      const updatedPosts = await postService.getPosts();
      setPosts(updatedPosts);

      navigate('/admin');
    } catch (err) {
      console.error('Error publishing post:', err);
      setError('Failed to publish. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const formatPreviewDate = () => {
    if (!eventDate) return null;
    const d = buildEventDate();
    if (!d) return null;
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isReady = content.trim().length > 0 && (postType === 'regular' || !!eventDate);

  return (
    <div className="cp-page">
      {/* Header */}
      <div className="cp-header">
        <button className="cp-back" onClick={() => navigate('/admin')} aria-label="Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="cp-title">Create Post</h1>
        <button
          className={`cp-mode-btn${mode === 'preview' ? ' active' : ''}`}
          onClick={() => setMode(m => m === 'edit' ? 'preview' : 'edit')}
        >
          {mode === 'edit' ? 'Preview' : 'Edit'}
        </button>
      </div>

      {mode === 'edit' ? (
        <div className="cp-body">

          {/* Post type */}
          <div className="cp-section">
            <div className="cp-pills">
              {(['regular', 'event', 'announcement'] as PostType[]).map(t => (
                <button
                  key={t}
                  className={`cp-pill${postType === t ? ' active' : ''}`}
                  onClick={() => setPostType(t)}
                >
                  {t === 'regular' ? '✍️ Post' : t === 'event' ? '📅 Event' : '📢 Announcement'}
                </button>
              ))}
            </div>
          </div>

          {/* Headline */}
          <div className="cp-section">
            <label className="cp-label">Headline</label>
            <input
              className="cp-input"
              placeholder="Add a headline…"
              value={headline}
              onChange={e => setHeadline(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="cp-section">
            <label className="cp-label">Content *</label>
            <textarea
              className="cp-textarea"
              placeholder="What's happening? Share details with the club…"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={5}
            />
            <div className="cp-emoji-row">
              {EMOJIS.map(e => (
                <button key={e} className="cp-emoji-btn" onClick={() => insertEmoji(e)} type="button">{e}</button>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="cp-section">
            <label className="cp-label">Image</label>
            <div className="cp-image-tabs">
              <button className={`cp-image-tab${imageMode === 'upload' ? ' active' : ''}`} onClick={() => setImageMode('upload')}>📁 Upload file</button>
              <button className={`cp-image-tab${imageMode === 'url' ? ' active' : ''}`} onClick={() => setImageMode('url')}>🔗 URL</button>
            </div>
            {imageMode === 'upload' ? (
              <label className="cp-upload-area">
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                {image ? (
                  <div className="cp-image-preview-wrap">
                    <img src={image} alt="Preview" className="cp-image-preview" />
                    <button className="cp-image-remove" onClick={e => { e.preventDefault(); setImage(null); }}>✕</button>
                  </div>
                ) : (
                  <div className="cp-upload-placeholder">
                    <span className="cp-upload-icon">📷</span>
                    <p>Tap to upload an image</p>
                    <p className="cp-upload-hint">JPG, PNG, GIF — max 5MB</p>
                  </div>
                )}
              </label>
            ) : (
              <div>
                <input
                  className="cp-input"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
                {imageUrl && (
                  <div className="cp-image-preview-wrap" style={{ marginTop: 10 }}>
                    <img src={imageUrl} alt="Preview" className="cp-image-preview" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Event / Announcement specific */}
          {(postType === 'event' || postType === 'announcement') && (
            <>
              <div className="cp-section">
                <label className="cp-label">Date & Time *</label>
                <div className="cp-row">
                  <input type="date" className="cp-input" value={eventDate} onChange={e => setEventDate(e.target.value)} />
                  <input type="time" className="cp-input" value={eventTime} onChange={e => setEventTime(e.target.value)} />
                </div>
              </div>

              <div className="cp-section">
                <label className="cp-label">Location</label>
                <input className="cp-input" placeholder="Venue, address, or online" value={location} onChange={e => setLocation(e.target.value)} />
              </div>

              <div className="cp-section">
                <label className="cp-label">Registration Deadline</label>
                <div className="cp-row">
                  <input type="date" className="cp-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
                  <input type="time" className="cp-input" value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)} />
                </div>
              </div>

              {/* Paid event toggle */}
              <div className="cp-section cp-paid-section">
                <div className="cp-paid-toggle-row">
                  <div>
                    <p className="cp-label" style={{ marginBottom: 2 }}>Paid Event</p>
                    <p className="cp-hint">Charge members to attend this event</p>
                  </div>
                  <button
                    className={`cp-toggle${isPaid ? ' on' : ''}`}
                    onClick={() => setIsPaid(p => !p)}
                    aria-label="Toggle paid event"
                  >
                    <span className="cp-toggle-thumb" />
                  </button>
                </div>

                {isPaid && (
                  <div className="cp-paid-fields">
                    <div className="cp-section">
                      <label className="cp-label">Payment Type</label>
                      <div className="cp-pills">
                        {([['one-time', '🎫 Ticket'], ['donation', '💝 Donation'], ['free', '🎁 Free Entry']] as [PaymentType, string][]).map(([val, label]) => (
                          <button
                            key={val}
                            className={`cp-pill${paymentType === val ? ' active' : ''}`}
                            onClick={() => setPaymentType(val)}
                          >{label}</button>
                        ))}
                      </div>
                    </div>

                    {paymentType !== 'free' && (
                      <div className="cp-section">
                        <label className="cp-label">Price</label>
                        <div className="cp-price-row">
                          <select className="cp-select" value={currency} onChange={e => setCurrency(e.target.value as Currency)}>
                            <option value="GBP">£ GBP</option>
                            <option value="EUR">€ EUR</option>
                            <option value="USD">$ USD</option>
                          </select>
                          <input
                            type="number"
                            className="cp-input"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            value={ticketPrice}
                            onChange={e => setTicketPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="cp-stripe-notice">
                      <span>💳</span>
                      <p>Stripe payment integration coming soon. Ticket price will be stored and used when payments are enabled.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {error && <div className="cp-error">{error}</div>}
        </div>
      ) : (
        /* ─── PREVIEW MODE ─────────────────────────────────────── */
        <div className="cp-preview-body">
          <p className="cp-preview-label">This is how your post will appear in the feed</p>
          <div className="cp-preview-card">
            {/* Author row */}
            <div className="cp-preview-author">
              <div className="cp-preview-avatar">
                {currentUser?.profileImage ? (
                  <img src={currentUser.profileImage} alt={currentUser.fullName} />
                ) : (
                  <span>{currentUser?.fullName?.charAt(0) ?? 'A'}</span>
                )}
              </div>
              <div className="cp-preview-author-info">
                <span className="cp-preview-name">{currentUser?.fullName ?? 'Admin'}</span>
                <span className="cp-preview-time">just now</span>
              </div>
              <span className="cp-preview-type-badge">
                {postType === 'event' ? '📅' : postType === 'announcement' ? '📢' : '✍️'}
              </span>
            </div>

            {/* Headline */}
            {headline && <p className="cp-preview-headline">{headline}</p>}

            {/* Image */}
            {effectiveImage && (
              <div className="cp-preview-image-wrap">
                <img src={effectiveImage} alt="Post" className="cp-preview-image" />
              </div>
            )}

            {/* Content */}
            <div className="cp-preview-content">
              <p className="cp-preview-text">{content || <span className="cp-preview-placeholder">Your content will appear here…</span>}</p>
            </div>

            {/* Event details */}
            {(postType === 'event' || postType === 'announcement') && (eventDate || location) && (
              <div className="cp-preview-meta">
                {formatPreviewDate() && (
                  <div className="cp-preview-meta-row">
                    <span>📅</span>
                    <span>{formatPreviewDate()}</span>
                  </div>
                )}
                {location && (
                  <div className="cp-preview-meta-row">
                    <span>📍</span>
                    <span>{location}</span>
                  </div>
                )}
                {isPaid && ticketPrice && paymentType !== 'free' && (
                  <div className="cp-preview-meta-row">
                    <span>🎫</span>
                    <span>
                      {paymentType === 'donation' ? 'Donation: ' : 'Ticket: '}
                      {CURRENCY_SYMBOLS[currency]}{parseFloat(ticketPrice || '0').toFixed(2)}
                    </span>
                  </div>
                )}
                {isPaid && paymentType === 'free' && (
                  <div className="cp-preview-meta-row">
                    <span>🎁</span>
                    <span>Free Entry</span>
                  </div>
                )}
              </div>
            )}

            {/* Engagement row */}
            <div className="cp-preview-actions">
              <button className="cp-preview-action">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>Like</span>
              </button>
              <button className="cp-preview-action">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Comment</span>
              </button>
              {(postType === 'event' || postType === 'announcement') && (
                <button className="cp-preview-action cp-preview-register">
                  {isPaid && paymentType !== 'free' ? '🎫 Buy Ticket' : '✓ Register Interest'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="cp-footer">
        <button
          className="cp-footer-preview-btn"
          onClick={() => setMode(m => m === 'edit' ? 'preview' : 'edit')}
        >
          {mode === 'edit' ? 'Preview' : '← Edit'}
        </button>
        <button
          className="cp-publish-btn"
          onClick={handlePublish}
          disabled={!isReady || publishing}
        >
          {publishing ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </div>
  );
};

export default CreatePostPage;
