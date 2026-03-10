import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userService, postService, eventService, announcementService, invitationService, advertisementService } from '../services/localDataService';
import './AdminPage.css';

interface AdminStats {
  totalMembers: number;
  totalPosts: number;
  totalEvents: number;
  totalAnnouncements: number;
  activeInvitations: number;
  newMembersThisMonth: number;
  activeAds: number;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { currentUser, posts, events } = useApp();
  const [stats, setStats] = useState<AdminStats>({
    totalMembers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalAnnouncements: 0,
    activeInvitations: 0,
    newMembersThisMonth: 0,
    activeAds: 0,
  });
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Guard: redirect non-admins
  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) {
      navigate('/feed');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, allPosts, allEvents, allAnnouncements, codes, allAds] = await Promise.all([
          userService.getAllUsers(),
          postService.getPosts(),
          eventService.getEvents(),
          announcementService.getAnnouncements(),
          invitationService.getAllInvitationCodes(),
          advertisementService.getActive(),
        ]);

        const nonAdmins = users.filter(u => !u.isAdmin);

        setRecentMembers(nonAdmins.slice(-5).reverse());

        setStats({
          totalMembers: nonAdmins.length,
          totalPosts: allPosts.length,
          totalEvents: allEvents.length,
          totalAnnouncements: allAnnouncements.length,
          activeInvitations: codes.filter((c: any) => c.isActive || c.active).length,
          newMembersThisMonth: nonAdmins.length,
          activeAds: allAds.length,
        });
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const upcomingEvents = events
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentPosts = posts.slice(0, 3);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));

  const formatShortDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date));

  if (!currentUser?.isAdmin) return null;

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-bg" />
        <div className="admin-page-header-content">
          <div className="admin-page-header-top">
            <button className="admin-back-btn" onClick={() => navigate('/feed')}>‹</button>
            <div className="admin-header-brand">
              <span className="admin-header-badge">Admin</span>
              <h1 className="admin-header-title">Dashboard</h1>
            </div>
            <button className="admin-header-avatar-btn" onClick={() => navigate('/admin-profile')}>
              {currentUser.profileImage ? (
                <img src={currentUser.profileImage} alt={currentUser.fullName} className="admin-header-avatar" />
              ) : (
                <div className="admin-header-avatar admin-header-avatar-placeholder">
                  {currentUser.fullName.charAt(0)}
                </div>
              )}
            </button>
          </div>
          <p className="admin-header-greeting">
            Welcome back, {currentUser.fullName.split(' ')[0]} 👋
          </p>
        </div>
      </div>

      <div className="admin-page-body">

        {/* Stats grid */}
        <section className="admin-section">
          <h2 className="admin-section-title">Overview</h2>
          {loading ? (
            <div className="admin-stats-skeleton">
              {[1,2,3,4].map(i => <div key={i} className="admin-stat-skeleton-card" />)}
            </div>
          ) : (
            <div className="admin-stats-grid">
              <div className="admin-stat-card members">
                <div className="admin-stat-icon">👥</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-value">{stats.totalMembers}</span>
                  <span className="admin-stat-label">Members</span>
                </div>
              </div>
              <div className="admin-stat-card posts">
                <div className="admin-stat-icon">📝</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-value">{stats.totalPosts}</span>
                  <span className="admin-stat-label">Posts</span>
                </div>
              </div>
              <div className="admin-stat-card events">
                <div className="admin-stat-icon">📅</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-value">{stats.totalEvents}</span>
                  <span className="admin-stat-label">Events</span>
                </div>
              </div>
              <div className="admin-stat-card invites">
                <div className="admin-stat-icon">🎫</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-value">{stats.activeInvitations}</span>
                  <span className="admin-stat-label">Active Invites</span>
                </div>
              </div>
              <div className="admin-stat-card ads">
                <div className="admin-stat-icon">📣</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-value">{stats.activeAds}</span>
                  <span className="admin-stat-label">Live Ads</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="admin-section">
          <h2 className="admin-section-title">Quick Actions</h2>
          <div className="admin-actions-grid">
            <button className="admin-action-tile create-post" onClick={() => navigate('/admin/create-post')}>
              <span className="admin-action-tile-icon">✍️</span>
              <span className="admin-action-tile-label">Create Post</span>
            </button>
            <button className="admin-action-tile manage-members" onClick={() => navigate('/admin-console')}>
              <span className="admin-action-tile-icon">👤</span>
              <span className="admin-action-tile-label">Manage Members</span>
            </button>
            <button className="admin-action-tile view-events" onClick={() => navigate('/events')}>
              <span className="admin-action-tile-icon">🗓</span>
              <span className="admin-action-tile-label">View Events</span>
            </button>
            <button className="admin-action-tile invitations" onClick={() => navigate('/admin-profile')}>
              <span className="admin-action-tile-icon">🎫</span>
              <span className="admin-action-tile-label">Invitations</span>
            </button>
            <button className="admin-action-tile announcements" onClick={() => navigate('/announcements')}>
              <span className="admin-action-tile-icon">📢</span>
              <span className="admin-action-tile-label">Announcements</span>
            </button>
            <button className="admin-action-tile console" onClick={() => navigate('/admin-console')}>
              <span className="admin-action-tile-icon">⚙️</span>
              <span className="admin-action-tile-label">Console</span>
            </button>
            <button className="admin-action-tile messages" onClick={() => navigate('/admin/messages')}>
              <span className="admin-action-tile-icon">💬</span>
              <span className="admin-action-tile-label">Messages</span>
            </button>
            <button className="admin-action-tile ads-manager" onClick={() => navigate('/admin/ads')}>
              <span className="admin-action-tile-icon">📣</span>
              <span className="admin-action-tile-label">Ad Manager</span>
            </button>
          </div>
        </section>

        {/* Upcoming events */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Upcoming Events</h2>
            <button className="admin-section-link" onClick={() => navigate('/events')}>See all</button>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="admin-empty-card">
              <span>📅</span>
              <p>No upcoming events</p>
            </div>
          ) : (
            <div className="admin-events-list">
              {upcomingEvents.map(event => (
                <div key={event.id} className="admin-event-row">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="admin-event-thumb" />
                  ) : (
                    <div className="admin-event-thumb admin-event-thumb-placeholder">📅</div>
                  )}
                  <div className="admin-event-info">
                    <p className="admin-event-name">{event.title}</p>
                    <p className="admin-event-meta">
                      {formatShortDate(event.date)}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                  <span className="admin-event-attendees">{event.attendees.length} going</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent members */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Recent Members</h2>
            <button className="admin-section-link" onClick={() => navigate('/admin-console')}>See all</button>
          </div>
          {recentMembers.length === 0 ? (
            <div className="admin-empty-card">
              <span>👥</span>
              <p>No members yet</p>
            </div>
          ) : (
            <div className="admin-members-list">
              {recentMembers.map(member => (
                <div
                  key={member.id}
                  className="admin-member-row"
                  onClick={() => navigate(`/profile/${member.id}`)}
                >
                  {member.profileImage ? (
                    <img src={member.profileImage} alt={member.fullName} className="admin-member-avatar" />
                  ) : (
                    <div className="admin-member-avatar admin-member-avatar-placeholder">
                      {member.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="admin-member-info">
                    <p className="admin-member-name">{member.fullName}</p>
                    <p className="admin-member-email">{member.email}</p>
                  </div>
                  <span className="admin-member-arrow">›</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent posts */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Recent Posts</h2>
            <button className="admin-section-link" onClick={() => navigate('/feed')}>See all</button>
          </div>
          {recentPosts.length === 0 ? (
            <div className="admin-empty-card">
              <span>📝</span>
              <p>No posts yet</p>
            </div>
          ) : (
            <div className="admin-posts-list">
              {recentPosts.map(post => (
                <div key={post.id} className="admin-post-row">
                  {post.image && (
                    <img src={post.image} alt="Post" className="admin-post-thumb" />
                  )}
                  <div className="admin-post-info">
                    <p className="admin-post-author">{post.authorName}</p>
                    <p className="admin-post-preview">{post.content.substring(0, 60)}…</p>
                    <p className="admin-post-date">{formatDate(post.createdAt)}</p>
                  </div>
                  <div className="admin-post-stats">
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

    </div>
  );
};

export default AdminPage;
