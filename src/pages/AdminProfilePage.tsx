import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userService, postService, invitationService } from '../services/localDataService';
import { sendInvite, getAllInvites } from '../services/inviteService';
import { User } from '../types';
import PostInteractions from '../components/PostInteractions';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import './AdminProfilePage.css';

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const { events, announcements, posts, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'about' | 'friends' | 'events' | 'posts' | 'gallery' | 'invitations'>('about');
  const [friends, setFriends] = useState<any[]>([]);
  const [adminPosts, setAdminPosts] = useState<any[]>([]);
  const [invitationCodes, setInvitationCodes] = useState<any[]>([]);
  const [emailInvites, setEmailInvites] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [newCodeOptions, setNewCodeOptions] = useState({
    code: '',
    maxUses: '',
    expiresInDays: '',
  });
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    eventsHosted: 0,
    membersConnected: 0,
    yearsActive: 0,
    countriesRepresented: 0,
    postsCount: 0,
  });
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await userService.getAllUsers();
        // Find admin: by email first, then any user with isAdmin, then currentUser if admin
        let actualAdminUser: User | null = users.find(u => u.isAdmin) ?? null;
        if (!actualAdminUser && currentUser?.isAdmin) {
          actualAdminUser = currentUser;
        }
        if (!actualAdminUser) {
          console.error('Admin user not found. Ensure a user exists in the database with is_admin = true.');
          return;
        }
        setAdminUser(actualAdminUser);

        const nonAdminUsers = users.filter(u => u.id !== actualAdminUser!.id && !u.isAdmin);
        setFriends(nonAdminUsers);

        // Load admin posts - check by admin ID
        const allPosts = await postService.getPosts();
        const adminPostsData = allPosts.filter(post => 
          post.authorId === actualAdminUser.id ||
          post.authorName === actualAdminUser.fullName
        );
        setAdminPosts(adminPostsData);

        // Calculate live stats
        const eventsHosted = events.filter(e => 
          e.createdBy === actualAdminUser.id
        ).length;
        
        const membersConnected = nonAdminUsers.length;
        
        const memberSince = actualAdminUser.createdAt ? new Date(actualAdminUser.createdAt) : new Date();
        const yearsActive = Math.max(1, Math.floor((new Date().getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 365)));
        
        // Extract unique countries from user addresses
        const allUserAddresses = [actualAdminUser.address, ...nonAdminUsers.map(u => u.address)].filter(Boolean);
        const countries = new Set(
          allUserAddresses.map(addr => {
            // Extract country from address (assuming format like "City, Country")
            const parts = addr?.split(',').map(s => s.trim());
            return parts && parts.length > 1 ? parts[parts.length - 1] : 'Unknown';
          })
        );
        const countriesRepresented = Math.max(1, countries.size);

        const postsCount = adminPostsData.length;

        setStats({
          eventsHosted,
          membersConnected,
          yearsActive,
          countriesRepresented,
          postsCount,
        });
      } catch (error) {
        console.error('Error loading admin profile data:', error);
      }
    };
    loadData();
  }, [events, posts, currentUser]);

  // Load invitation codes and email invites when tab is active
  useEffect(() => {
    if (activeTab === 'invitations') {
      const loadData = async () => {
        try {
          const [codes, invites] = await Promise.all([
            invitationService.getAllInvitationCodes(),
            getAllInvites(),
          ]);
          setInvitationCodes(codes);
          setEmailInvites(invites);
        } catch (error) {
          console.error('Error loading invitations:', error);
        }
      };
      loadData();
    }
  }, [activeTab]);

  const handleGenerateCode = async () => {
    setIsGeneratingCode(true);
    try {
      const expiresAt = newCodeOptions.expiresInDays 
        ? new Date(Date.now() + parseInt(newCodeOptions.expiresInDays) * 24 * 60 * 60 * 1000)
        : undefined;

      const maxUses = newCodeOptions.maxUses ? parseInt(newCodeOptions.maxUses) : undefined;

      const code = await invitationService.generateInvitationCode(
        maxUses || 100,
        expiresAt || null,
        newCodeOptions.code || undefined
      );

      // Reload codes
      const codes = await invitationService.getAllInvitationCodes();
      setInvitationCodes(codes);

      // Reset form
      setNewCodeOptions({ code: '', maxUses: '', expiresInDays: '' });
      
      // Show success message
      alert(`Invitation code generated: ${code}`);
    } catch (error: any) {
      console.error('Error generating code:', error);
      alert(`Error generating code: ${error.message}`);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleToggleCodeStatus = async (code: string, currentStatus: boolean) => {
    try {
      await invitationService.updateInvitationCode(code, { isActive: !currentStatus });
      const codes = await invitationService.getAllInvitationCodes();
      setInvitationCodes(codes);
    } catch (error) {
      console.error('Error updating code status:', error);
      alert('Error updating code status');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Code copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy code');
    });
  };

  const handleSendInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) {
      alert('Please enter an email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    setIsSendingInvite(true);
    try {
      await sendInvite(email);
      setInviteEmail('');
      const invites = await getAllInvites();
      setEmailInvites(invites);
      alert('Invitation sent! They will receive an email with a link to register.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send invite';
      alert(msg);
    } finally {
      setIsSendingInvite(false);
    }
  };
  
  const handleFriendClick = (friendId: string) => {
    navigate(`/profile/${friendId}`);
  };
  
  // Filter events created by admin
  const hostedEvents = adminUser ? events.filter(e => e.createdBy === adminUser.id) : [];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatMemberSince = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

  const memberSince = adminUser?.createdAt ? new Date(adminUser.createdAt) : null;

  return (
    <div className="admin-profile-page">
      <AppHeader />
      
      {/* Hero Section - cover image or gradient */}
      <div className={`admin-hero ${adminUser?.coverImage ? '' : 'admin-hero-gradient'}`}>
        {adminUser?.coverImage && (
          <img src={adminUser.coverImage} alt="" className="admin-hero-image" aria-hidden />
        )}
        <div className="admin-hero-overlay"></div>
        <div className="admin-hero-content">
          <span className="admin-hero-badge">Administrator</span>
        </div>
      </div>

      <div className="admin-profile-content">
        {!adminUser ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading admin profile...</div>
        ) : (
          <>
        {/* Profile Header */}
        <div className="admin-profile-header">
          <div className="admin-avatar-container">
            {adminUser.profileImage ? (
              <img
                src={adminUser.profileImage}
                alt={adminUser.fullName}
                className="admin-avatar"
              />
            ) : (
              <div className="admin-avatar admin-avatar-placeholder">
                {adminUser.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="admin-verified-badge">✓</div>
          </div>
          
          <div className="admin-name-row">
            <h1 className="admin-name">{adminUser.fullName}</h1>
            <div className="admin-profile-actions">
              <button 
                className="admin-action-btn console-btn"
                onClick={() => navigate('/admin-console')}
                title="Admin Console"
              >
                ⚙️ Console
              </button>
              <button 
                className="admin-action-btn feed-btn"
                onClick={() => navigate('/feed')}
                title="View Newsfeed"
              >
                📰 Feed
              </button>
            </div>
          </div>
          <p className="admin-role">Administrator</p>
          {adminUser.address && <p className="admin-location">📍 {adminUser.address}</p>}
          
          {adminUser.bio && (
            <div className="admin-quote">
              <span className="quote-mark">"</span>
              {adminUser.bio.replace(/"/g, '')}
              <span className="quote-mark">"</span>
            </div>
          )}

          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.eventsHosted}</span>
              <span className="admin-stat-label">Events Hosted</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.membersConnected}</span>
              <span className="admin-stat-label">Members</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.yearsActive}</span>
              <span className="admin-stat-label">Years Active</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.countriesRepresented}</span>
              <span className="admin-stat-label">Countries</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="admin-social-links">
            {adminUser.socialLinks?.instagram && (
              <a href={`https://instagram.com/${adminUser.socialLinks.instagram.replace('@', '')}`} className="social-link instagram">
                <span className="social-icon">📷</span>
              </a>
            )}
            {adminUser.socialLinks?.facebook && (
              <a href={`https://facebook.com/${adminUser.socialLinks.facebook}`} className="social-link facebook">
                <span className="social-icon">📘</span>
              </a>
            )}
            {adminUser.socialLinks?.twitter && (
              <a href={`https://twitter.com/${adminUser.socialLinks.twitter.replace('@', '')}`} className="social-link twitter">
                <span className="social-icon">🐦</span>
              </a>
            )}
            {adminUser.socialLinks?.linkedin && (
              <a href={`https://linkedin.com/in/${adminUser.socialLinks.linkedin}`} className="social-link linkedin">
                <span className="social-icon">💼</span>
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="admin-profile-action-buttons">
            <button 
              className="admin-action-btn edit-profile-btn"
              onClick={() => navigate('/profile')}
              title="Edit your profile"
            >
              ✏️ Edit Profile
            </button>
            <button 
              className="create-post-button"
              onClick={() => navigate('/admin/create-post')}
            >
              ➕ Create Post
            </button>
            <button 
              className="admin-console-button"
              onClick={() => navigate('/admin-console')}
            >
              ⚙️ Admin Console
            </button>
            <button 
              className="feed-button"
              onClick={() => navigate('/feed')}
            >
              📰 View Feed
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs-container">
          <div className="admin-tabs">
            <button
              className={`admin-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
              title="About"
            >
              <img src="/info.png" alt="About" className="admin-tab-icon" />
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
              title="Events"
            >
              <img src="/calendar-check.png" alt="Events" className="admin-tab-icon" />
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
              title="Posts"
            >
              <img src="/write.png" alt="Posts" className="admin-tab-icon" />
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
              title="Gallery"
            >
              <img src="/gallery.png" alt="Gallery" className="admin-tab-icon" />
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
              title={`Friends (${friends.length})`}
            >
              <img src="/friends.png" alt="Friends" className="admin-tab-icon" />
              <span className="friends-count">{friends.length}</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'invitations' ? 'active' : ''}`}
              onClick={() => setActiveTab('invitations')}
              title="Invitation Codes"
            >
              <span className="admin-tab-icon-text">🎫</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="admin-tab-content">
          {activeTab === 'about' && (
            <div className="about-section">
              <div className="about-card">
                <h2 className="about-card-title">About {adminUser?.fullName || 'Admin'}</h2>
                {adminUser?.bio ? (
                  <p className="admin-bio">{adminUser.bio}</p>
                ) : (
                  <p className="admin-bio-empty">No bio added yet. Edit your profile to add one.</p>
                )}
                {memberSince && (
                  <p className="member-since">
                    <span className="member-since-label">Member since </span>
                    <span className="member-since-value">{formatMemberSince(memberSince)}</span>
                  </p>
                )}
              </div>

              <div className="about-card">
                <h2 className="about-card-title">Contact</h2>
                <div className="contact-info">
                  {adminUser?.email && (
                    <div className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <span className="contact-value">{adminUser.email}</span>
                    </div>
                  )}
                  {adminUser?.phone && (
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span className="contact-value">{adminUser.phone}</span>
                    </div>
                  )}
                  {adminUser?.address && (
                    <div className="contact-item">
                      <span className="contact-icon">📍</span>
                      <span className="contact-value">{adminUser.address}</span>
                    </div>
                  )}
                  {!adminUser?.email && !adminUser?.phone && !adminUser?.address && (
                    <p className="admin-bio-empty">No contact info added.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="friends-section">
              <div className="friends-header">
                <h2 className="friends-title">Friends ({friends.length})</h2>
                <span className="friends-subtitle">All members connected with Eugene</span>
              </div>
              
              {friends.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">👥</span>
                  <p>No friends yet</p>
                </div>
              ) : (
                <div className="friends-grid">
                  {friends.map((friend) => (
                    <div 
                      key={friend.id} 
                      className="friend-card"
                      onClick={() => handleFriendClick(friend.id)}
                    >
                      {friend.profileImage ? (
                        <img
                          src={friend.profileImage}
                          alt={friend.fullName}
                          className="friend-avatar"
                        />
                      ) : (
                        <div className="friend-avatar-placeholder">
                          {friend.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="friend-name">{friend.fullName}</div>
                      {friend.address && (
                        <div className="friend-location">📍 {friend.address}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-section">
              <div className="events-header">
                <h2 className="events-title">Hosted Events</h2>
                <span className="events-count">{stats.eventsHosted} {stats.eventsHosted === 1 ? 'event' : 'events'}</span>
              </div>
              
              {/* Upcoming Events */}
              <div className="events-category">
                <h3 className="category-title">Upcoming Events</h3>
                <div className="admin-events-list">
                  {hostedEvents.map((event) => (
                    <div key={event.id} className="admin-event-card">
                      <div className={`admin-event-image has-admin-watermark${!event.image ? ' admin-event-image-placeholder' : ''}`}>
                        {event.image ? <img src={event.image} alt={event.title} /> : <span>📅</span>}
                        <div className="event-date-badge">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="admin-event-details">
                        <h3 className="admin-event-title">{event.title}</h3>
                        <p className="admin-event-description">{event.description.substring(0, 100)}...</p>
                        <div className="admin-event-meta">
                          <span className="event-time">🕐 {formatDate(event.date)}</span>
                          <span className="event-location">📍 {event.location}</span>
                        </div>
                        <div className="event-capacity">
                          <div className="capacity-bar">
                            <div 
                              className="capacity-fill" 
                              style={{ width: `${(event.attendees.length / (event.maxAttendees || 50)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="capacity-text">
                            {event.attendees.length}/{event.maxAttendees || 50} attending
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Announcements */}
              <div className="events-category">
                <h3 className="category-title">Recent Announcements</h3>
                <div className="announcements-preview">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="announcement-mini">
                      <span className="announcement-type">{announcement.type}</span>
                      <h4>{announcement.title}</h4>
                      <p>{announcement.content.substring(0, 80)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-section">
              <div className="posts-header">
                <h2 className="posts-title">Posts by {adminUser?.fullName?.split(' ')[0] || 'Admin'}</h2>
                <div className="posts-header-right">
                  <span className="posts-count">{stats.postsCount} {stats.postsCount === 1 ? 'post' : 'posts'}</span>
                  <button 
                    className="create-post-btn"
                    onClick={() => navigate('/admin/create-post')}
                  >
                    + Create Post
                  </button>
                </div>
              </div>
              
              <div className="admin-posts-list">
                {adminPosts.map((post) => (
                  <div key={post.id} className="admin-post-card">
                    {post.image && (
                      <div className="admin-post-image has-admin-watermark">
                        <img src={post.image} alt="Post" />
                      </div>
                    )}
                    <div className="admin-post-content">
                      <div className="post-author-row">
                        {adminUser?.profileImage ? (
                          <img src={adminUser.profileImage} alt={adminUser?.fullName || 'Admin'} className="post-author-avatar" />
                        ) : (
                          <div className="post-author-avatar post-author-avatar-placeholder">
                            {adminUser?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                        )}
                      <div className="post-author-info">
                          <span className="post-author-name">{adminUser?.fullName || 'Admin'}</span>
                          <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      {post.headline && (
                        <h3 className="post-headline">{post.headline}</h3>
                      )}
                      <p className="post-text">{post.content}</p>
                      {currentUser && (
                        <PostInteractions
                          post={post}
                          currentUser={currentUser}
                          onLike={async (postId) => {
                            try {
                              const post = adminPosts.find(p => p.id === postId);
                              if (!post) return;
                              
                              const isLiked = post.likes.includes(currentUser.id);
                              const updatedLikes = isLiked
                                ? post.likes.filter((id: string) => id !== currentUser.id)
                                : [...post.likes, currentUser.id];
                              
                              await postService.updatePost(postId, { likes: updatedLikes });
                              const updatedPosts = await postService.getPosts();
                              const adminPostsData = updatedPosts.filter(p => 
                                (adminUser && p.authorId === adminUser.id) || 
                                p.authorId === currentUser.id ||
                                (adminUser && p.authorName === adminUser.fullName)
                              );
                              setAdminPosts(adminPostsData);
                            } catch (error) {
                              console.error('Error liking post:', error);
                            }
                          }}
                          onComment={async (postId, commentText) => {
                            try {
                              const post = adminPosts.find(p => p.id === postId);
                              if (!post) return;
                              
                              const newComment = {
                                id: `comment-${Date.now()}`,
                                authorId: currentUser.id,
                                authorName: currentUser.fullName,
                                authorImage: currentUser.profileImage,
                                content: commentText,
                                createdAt: new Date(),
                              };
                              
                              const updatedComments = [...(post.comments || []), newComment];
                              await postService.updatePost(postId, { comments: updatedComments });
                              const updatedPosts = await postService.getPosts();
                              const adminPostsData = updatedPosts.filter(p => 
                                (adminUser && p.authorId === adminUser.id) || 
                                p.authorId === currentUser.id ||
                                (adminUser && p.authorName === adminUser.fullName)
                              );
                              setAdminPosts(adminPostsData);
                            } catch (error) {
                              console.error('Error adding comment:', error);
                            }
                          }}
                          onRegisterInterest={async (postId) => {
                            try {
                              const post = adminPosts.find(p => p.id === postId);
                              if (!post) return;
                              
                              const interestedUsers = post.interestedUsers || [];
                              const isInterested = interestedUsers.includes(currentUser.id);
                              const updatedInterested = isInterested
                                ? interestedUsers.filter((id: string) => id !== currentUser.id)
                                : [...interestedUsers, currentUser.id];
                              
                              await postService.updatePost(postId, { interestedUsers: updatedInterested });
                              const updatedPosts = await postService.getPosts();
                              const adminPostsData = updatedPosts.filter(p => 
                                (adminUser && p.authorId === adminUser.id) || 
                                p.authorId === currentUser.id ||
                                (adminUser && p.authorName === adminUser.fullName)
                              );
                              setAdminPosts(adminPostsData);
                            } catch (error) {
                              console.error('Error registering interest:', error);
                            }
                          }}
                          onAddToCalendar={(post) => {
                            if (!post.eventDate) return;
                            
                            const startDate = new Date(post.eventDate);
                            const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
                            
                            const formatICSDate = (date: Date) => {
                              return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                            };
                            
                            const icsContent = [
                              'BEGIN:VCALENDAR',
                              'VERSION:2.0',
                              'PRODID:-//Rendezvous//EN',
                              'BEGIN:VEVENT',
                              `DTSTART:${formatICSDate(startDate)}`,
                              `DTEND:${formatICSDate(endDate)}`,
                              `SUMMARY:${post.headline || post.content.substring(0, 50)}`,
                              `DESCRIPTION:${post.content}`,
                              post.location ? `LOCATION:${post.location}` : '',
                              'END:VEVENT',
                              'END:VCALENDAR',
                            ].filter(Boolean).join('\r\n');
                            
                            const blob = new Blob([icsContent], { type: 'text/calendar' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${post.headline || 'event'}.ics`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                            
                            alert('Calendar event downloaded! Open the .ics file to add to your calendar.');
                          }}
                        />
                      )}
                      <div className="post-actions" style={{ display: 'none' }}>
                        <button className="post-action-btn">
                          ❤️ {post.likes.length} Likes
                        </button>
                        <button className="post-action-btn">
                          💬 {post.comments.length} Comments
                        </button>
                        <button className="post-action-btn">
                          🔗 Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="gallery-section">
              <div className="gallery-header">
                <h2 className="gallery-title">Photo Gallery</h2>
              </div>
              <div className="gallery-empty">
                <span>📷</span>
                <p>No photos yet. Add images to your posts to see them here.</p>
              </div>
            </div>
          )}

          {activeTab === 'invitations' && (
            <div className="invitations-section">
              <div className="invitations-header">
                <h2 className="invitations-title">Invitations</h2>
                <span className="invitations-count">{emailInvites.length} email invites · {invitationCodes.length} codes</span>
              </div>

              {/* Send Email Invite */}
              <div className="generate-code-card send-invite-card">
                <h3 className="generate-code-title">Send Email Invite</h3>
                <p className="generate-code-desc">Invite someone by email. They will receive a link to register.</p>
                <div className="generate-code-form send-invite-form">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendInvite()}
                  />
                  <button
                    className="generate-code-btn"
                    onClick={handleSendInvite}
                    disabled={isSendingInvite}
                  >
                    {isSendingInvite ? 'Sending...' : 'Send Invite'}
                  </button>
                </div>
              </div>

              {/* Generate New Invitation Code */}
              <div className="generate-code-card">
                <h3 className="generate-code-title">Generate New Invitation Code</h3>
                <div className="generate-code-form">
                  <div className="form-group">
                    <label className="form-label">Custom Code (optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Leave empty for random code"
                      value={newCodeOptions.code}
                      onChange={(e) => setNewCodeOptions({ ...newCodeOptions, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Max Uses (optional)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Unlimited"
                        value={newCodeOptions.maxUses}
                        onChange={(e) => setNewCodeOptions({ ...newCodeOptions, maxUses: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Expires In (days, optional)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Never expires"
                        value={newCodeOptions.expiresInDays}
                        onChange={(e) => setNewCodeOptions({ ...newCodeOptions, expiresInDays: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    className="generate-code-btn"
                    onClick={handleGenerateCode}
                    disabled={isGeneratingCode}
                  >
                    {isGeneratingCode ? 'Generating...' : 'Generate Code'}
                  </button>
                </div>
              </div>

              {/* Recent Email Invites */}
              {emailInvites.length > 0 && (
                <div className="codes-list">
                  <h3 className="codes-list-title">Recent Email Invites</h3>
                  <div className="codes-grid">
                    {emailInvites.slice(0, 10).map((inv) => (
                      <div key={inv.id} className={`code-card ${inv.used ? 'inactive' : ''}`}>
                        <div className="code-header">
                          <div className="code-value">
                            <strong>{inv.email}</strong>
                          </div>
                          <span className={`code-status-btn ${inv.used ? 'inactive' : 'active'}`}>
                            {inv.used ? 'Used' : 'Pending'}
                          </span>
                        </div>
                        <div className="code-details">
                          <div className="code-detail">
                            <span className="code-detail-label">Sent:</span>
                            <span className="code-detail-value">
                              {new Date(inv.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Codes List */}
              <div className="codes-list">
                <h3 className="codes-list-title">Invitation Codes</h3>
                {invitationCodes.length === 0 ? (
                  <div className="empty-state">
                    <p>No invitation codes yet</p>
                  </div>
                ) : (
                  <div className="codes-grid">
                    {invitationCodes.map((code) => {
                      const isExpired = code.expires_at && new Date(code.expires_at) < new Date();
                      const isUsedUp = code.max_uses && code.current_uses >= code.max_uses;
                      const isActive = code.active && !isExpired && !isUsedUp;
                      
                      return (
                        <div key={code.id} className={`code-card ${!isActive ? 'inactive' : ''}`}>
                          <div className="code-header">
                            <div className="code-value">
                              <strong>{code.code}</strong>
                              <button
                                className="copy-code-btn"
                                onClick={() => copyToClipboard(code.code)}
                                title="Copy code"
                              >
                                📋
                              </button>
                            </div>
                            <button
                              className={`code-status-btn ${code.active ? 'active' : 'inactive'}`}
                              onClick={() => handleToggleCodeStatus(code.code, code.active)}
                            >
                              {code.active ? '✓ Active' : '✗ Inactive'}
                            </button>
                          </div>
                          <div className="code-details">
                            <div className="code-detail">
                              <span className="code-detail-label">Uses:</span>
                              <span className="code-detail-value">
                                {code.current_uses}
                                {code.max_uses ? ` / ${code.max_uses}` : ' / ∞'}
                              </span>
                            </div>
                            {code.expires_at && (
                              <div className="code-detail">
                                <span className="code-detail-label">Expires:</span>
                                <span className={`code-detail-value ${isExpired ? 'expired' : ''}`}>
                                  {new Date(code.expires_at).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            <div className="code-detail">
                              <span className="code-detail-label">Created:</span>
                              <span className="code-detail-value">
                                {new Date(code.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {(isExpired || isUsedUp) && (
                            <div className="code-warning">
                              {isExpired ? '⚠️ Expired' : '⚠️ Usage limit reached'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </div>

      <BottomNav />
      
    </div>
  );
};

export default AdminProfilePage;

