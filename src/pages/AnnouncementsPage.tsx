import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Announcement, Advertisement, Post } from '../types';
import { announcementService, advertisementService, postService } from '../services/localDataService';
import Stories from '../components/Stories';
import AdvertCard from '../components/AdvertCard';
import PostInteractions from '../components/PostInteractions';
import PullToRefresh from '../components/PullToRefresh';
import './AnnouncementsPage.css';

type FeedItem =
  | { type: 'announcement'; announcement: Announcement; date: Date }
  | { type: 'post'; post: Post; date: Date }
  | { type: 'ad'; ad: Advertisement };

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const { announcements, setAnnouncements, posts, setPosts, currentUser, unreadNotificationsCount, logoutUser, updateUser } = useApp();
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [activeAds, setActiveAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [annData, postData] = await Promise.all([
          announcementService.getAnnouncements(),
          postService.getPosts(),
        ]);
        setAnnouncements(annData);
        setPosts(postData);
      } catch (error) {
        console.error('Error loading feed:', error);
      }
    };
    if (announcements.length === 0 || posts.length === 0) load();
  }, []);

  useEffect(() => {
    advertisementService.getActive().then(setActiveAds).catch(console.error);
  }, []);

  const handleRefresh = async () => {
    try {
      const [annData, postData, ads] = await Promise.all([
        announcementService.getAnnouncements(),
        postService.getPosts(),
        advertisementService.getActive(),
      ]);
      setAnnouncements(annData);
      setPosts(postData);
      setActiveAds(ads);
    } catch (error) {
      console.error('Error refreshing:', error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login', { replace: true });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const toggleLike = (id: string) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Build unified sorted feed with ads interspersed
  const buildFeed = (): FeedItem[] => {
    const raw: (FeedItem & { sortDate: Date })[] = [
      ...announcements.map(a => ({
        type: 'announcement' as const,
        announcement: a,
        date: new Date(a.date),
        sortDate: new Date(a.date),
      })),
      ...posts.map(p => ({
        type: 'post' as const,
        post: p,
        date: new Date(p.createdAt),
        sortDate: new Date(p.createdAt),
      })),
    ].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

    if (activeAds.length === 0) return raw;

    const items: FeedItem[] = [];
    const freq = activeAds[0]?.frequency ?? 3;
    let adIndex = 0;
    raw.forEach((item, i) => {
      items.push(item);
      if ((i + 1) % freq === 0) {
        items.push({ type: 'ad', ad: activeAds[adIndex % activeAds.length] });
        adIndex++;
      }
    });
    return items;
  };

  const feedItems = buildFeed();

  return (
    <div className="feed-page">
      {/* Top bar */}
      <div className="feed-topbar">
        <button className="feed-topbar-logout" onClick={handleLogout} aria-label="Logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
        <span className="feed-brand">Rendezvous</span>
        <div className="feed-topbar-actions">
          <button className="feed-topbar-btn" onClick={() => navigate('/notifications')} aria-label="Notifications">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadNotificationsCount > 0 && (
              <span className="feed-notif-dot">{unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}</span>
            )}
          </button>
          <button className="feed-topbar-avatar" onClick={() => navigate('/profile')} aria-label="Profile">
            {currentUser?.profileImage ? (
              <img src={currentUser.profileImage} alt={currentUser.fullName} />
            ) : (
              <div className="feed-topbar-avatar-placeholder">
                {currentUser?.fullName?.charAt(0).toUpperCase() ?? 'U'}
              </div>
            )}
          </button>
        </div>
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <Stories />

        <div className="feed-list">
          {feedItems.map((item, index) => {
            if (item.type === 'ad') {
              return <AdvertCard key={`ad-${item.ad.id}-${index}`} ad={item.ad} />;
            }
            if (item.type === 'announcement') {
              return (
                <AnnouncementCard
                  key={item.announcement.id}
                  announcement={item.announcement}
                  liked={!!liked[item.announcement.id]}
                  onLike={() => toggleLike(item.announcement.id)}
                  formatTimeAgo={formatTimeAgo}
                />
              );
            }
            return (
              <PostCard
                key={item.post.id}
                post={item.post}
                currentUser={currentUser}
                posts={posts}
                setPosts={setPosts}
                updateUser={updateUser}
                navigate={navigate}
                formatTimeAgo={formatTimeAgo}
              />
            );
          })}
        </div>
      </PullToRefresh>
    </div>
  );
};

// ─── Announcement card ───────────────────────────────────────────────────────

interface AnnouncementCardProps {
  announcement: Announcement;
  liked: boolean;
  onLike: () => void;
  formatTimeAgo: (date: Date) => string;
}

const AnnouncementCard = ({ announcement, liked, onLike, formatTimeAgo }: AnnouncementCardProps) => (
  <div className="feed-card">
    <div className="feed-card-author">
      <div className="feed-author-avatar">
        <img src="/penilla-logo-3.png" alt="Admin" />
      </div>
      <div className="feed-author-info">
        <span className="feed-author-name">Rendezvous SC</span>
        <span className="feed-author-location">Mallorca, Spain</span>
      </div>
      <span className="feed-card-type-badge">📢</span>
    </div>

    {announcement.image && (
      <div className="feed-card-image-wrap">
        <img src={announcement.image} alt={announcement.title} className="feed-card-image" />
      </div>
    )}

    <div className="feed-card-body">
      <p className="feed-card-caption">
        <span className="feed-card-caption-name">{announcement.title}</span>
        {announcement.content && ` — ${announcement.content}`}
      </p>
      <p className="feed-card-time">{formatTimeAgo(announcement.date)}</p>
    </div>

    <div className="feed-card-actions">
      <button className={`feed-action-btn${liked ? ' liked' : ''}`} onClick={onLike} aria-label="Like">
        <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <button className="feed-action-btn" aria-label="Comment">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      <button className="feed-action-btn" aria-label="Share">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>
      {announcement.link && (
        <a href={announcement.link} target="_blank" rel="noopener noreferrer" className="feed-action-link">
          Learn more →
        </a>
      )}
      <button className="feed-action-btn feed-action-bookmark" aria-label="Bookmark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </div>
  </div>
);

// ─── Post card ───────────────────────────────────────────────────────────────

interface PostCardProps {
  post: Post;
  currentUser: any;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  updateUser: any;
  navigate: (path: string) => void;
  formatTimeAgo: (date: Date) => string;
}

const PostCard = ({ post, currentUser, posts, setPosts, updateUser, navigate, formatTimeAgo }: PostCardProps) => {
  const handleAuthorClick = () => {
    if (post.authorId === 'admin-1') navigate('/admin-profile');
    else navigate(`/profile/${post.authorId}`);
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    try {
      const p = posts.find(p => p.id === postId);
      if (!p) return;
      const isLiked = p.likes.includes(currentUser.id);
      const updatedLikes = isLiked ? p.likes.filter((id: string) => id !== currentUser.id) : [...p.likes, currentUser.id];
      await postService.updatePost(postId, { likes: updatedLikes });
      const updatedLikedPosts = isLiked
        ? (currentUser.likedPosts || []).filter((id: string) => id !== postId)
        : [...(currentUser.likedPosts || []), postId];
      await updateUser(currentUser.id, { likedPosts: updatedLikedPosts });
      setPosts(await postService.getPosts());
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string, commentText: string) => {
    if (!currentUser) return;
    try {
      const p = posts.find(p => p.id === postId);
      if (!p) return;
      const newComment = {
        id: `comment-${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.fullName,
        authorImage: currentUser.profileImage,
        content: commentText,
        createdAt: new Date(),
      };
      await postService.updatePost(postId, { comments: [...(p.comments || []), newComment] });
      setPosts(await postService.getPosts());
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleRegisterInterest = async (postId: string) => {
    if (!currentUser) return;
    try {
      const p = posts.find(p => p.id === postId);
      if (!p) return;
      const interested = p.interestedUsers || [];
      const isInterested = interested.includes(currentUser.id);
      await postService.updatePost(postId, {
        interestedUsers: isInterested ? interested.filter((id: string) => id !== currentUser.id) : [...interested, currentUser.id],
      });
      setPosts(await postService.getPosts());
    } catch (error) {
      console.error('Error registering interest:', error);
    }
  };

  return (
    <div className="feed-card">
      <div className="feed-card-author">
        <div className="feed-author-avatar" onClick={handleAuthorClick} style={{ cursor: 'pointer' }}>
          {post.authorImage ? (
            <img src={post.authorImage} alt={post.authorName} />
          ) : (
            <div className="feed-author-avatar-placeholder">{post.authorName.charAt(0).toUpperCase()}</div>
          )}
        </div>
        <div className="feed-author-info" onClick={handleAuthorClick} style={{ cursor: 'pointer' }}>
          <span className="feed-author-name">{post.authorName}</span>
          <span className="feed-author-location">{formatTimeAgo(post.createdAt)}</span>
        </div>
      </div>

      {post.headline && <p className="feed-post-headline">{post.headline}</p>}

      {post.image ? (
        <div className="feed-card-image-wrap">
          <img src={post.image} alt="Post" className="feed-card-image" />
        </div>
      ) : null}

      <div className="feed-card-body">
        <p className="feed-card-caption">{post.content}</p>
      </div>

      <PostInteractions
        post={post}
        currentUser={currentUser}
        onLike={handleLike}
        onComment={handleComment}
        onRegisterInterest={handleRegisterInterest}
        onAddToCalendar={(p) => {
          if (!p.eventDate) return;
          const start = new Date(p.eventDate);
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
          const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
          const ics = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
            `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
            `SUMMARY:${p.headline || p.content.substring(0, 50)}`,
            p.location ? `LOCATION:${p.location}` : '',
            'END:VEVENT', 'END:VCALENDAR',
          ].filter(Boolean).join('\r\n');
          const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
          const a = document.createElement('a');
          a.href = url; a.download = `${p.headline || 'event'}.ics`;
          document.body.appendChild(a); a.click();
          document.body.removeChild(a); URL.revokeObjectURL(url);
        }}
      />
    </div>
  );
};

export default AnnouncementsPage;
