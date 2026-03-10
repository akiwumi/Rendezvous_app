import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userService, postService, eventService, announcementService, invitationService } from '../services/localDataService';
import { User, Post, Event, Announcement } from '../types';
import AppHeader from '../components/AppHeader';
import './AdminConsolePage.css';

const AdminConsolePage = () => {
  const navigate = useNavigate();
  const { currentUser, posts, events, announcements, deleteUser, deletePost, deleteEvent, deleteAnnouncement } = useApp();
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'posts' | 'events' | 'announcements' | 'invitations'>('overview');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [invitationCodes, setInvitationCodes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalAnnouncements: 0,
    activeInvitations: 0,
  });

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate('/feed');
    }
  }, [currentUser, navigate]);

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, postsData, eventsData, announcementsData, codes] = await Promise.all([
          userService.getAllUsers(),
          postService.getPosts(),
          eventService.getEvents(),
          announcementService.getAnnouncements(),
          invitationService.getAllInvitationCodes(),
        ]);

        setAllUsers(users);
        setAllPosts(postsData);
        setAllEvents(eventsData);
        setAllAnnouncements(announcementsData);
        setInvitationCodes(codes);

        setStats({
          totalUsers: users.length,
          totalPosts: postsData.length,
          totalEvents: eventsData.length,
          totalAnnouncements: announcementsData.length,
          activeInvitations: codes.filter(c => c.isActive).length,
        });
      } catch (error) {
        console.error('Error loading admin console data:', error);
      }
    };

    if (currentUser?.isAdmin) {
      loadData();
    }
  }, [currentUser]);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await deleteUser(userId);
        setAllUsers(allUsers.filter(u => u.id !== userId));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(postId);
        setAllPosts(allPosts.filter(p => p.id !== postId));
        setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await deleteEvent(eventId);
        setAllEvents(allEvents.filter(e => e.id !== eventId));
        setStats(prev => ({ ...prev, totalEvents: prev.totalEvents - 1 }));
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      try {
        await deleteAnnouncement(announcementId);
        setAllAnnouncements(allAnnouncements.filter(a => a.id !== announcementId));
        setStats(prev => ({ ...prev, totalAnnouncements: prev.totalAnnouncements - 1 }));
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Failed to delete announcement');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  return (
    <div className="admin-console-page">
      <AppHeader />
      <div className="admin-console-container">
        <div className="admin-console-header">
          <h1 className="admin-console-title">Admin Console</h1>
          <div className="admin-console-actions">
            <button 
              className="admin-console-btn secondary"
              onClick={() => navigate('/feed')}
            >
              📰 View Feed
            </button>
            <button 
              className="admin-console-btn secondary"
              onClick={() => navigate('/admin-profile')}
            >
              👤 My Profile
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-console-tabs">
          <button
            className={`admin-tab ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`admin-tab ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            👥 Users ({stats.totalUsers})
          </button>
          <button
            className={`admin-tab ${activeSection === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveSection('posts')}
          >
            📝 Posts ({stats.totalPosts})
          </button>
          <button
            className={`admin-tab ${activeSection === 'events' ? 'active' : ''}`}
            onClick={() => setActiveSection('events')}
          >
            📅 Events ({stats.totalEvents})
          </button>
          <button
            className={`admin-tab ${activeSection === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveSection('announcements')}
          >
            📢 Announcements ({stats.totalAnnouncements})
          </button>
          <button
            className={`admin-tab ${activeSection === 'invitations' ? 'active' : ''}`}
            onClick={() => setActiveSection('invitations')}
          >
            🎫 Invitations ({stats.activeInvitations})
          </button>
        </div>

        {/* Content Sections */}
        <div className="admin-console-content">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="admin-section">
              <h2 className="section-title">Dashboard Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-value">{stats.totalPosts}</div>
                  <div className="stat-label">Total Posts</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-value">{stats.totalEvents}</div>
                  <div className="stat-label">Total Events</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📢</div>
                  <div className="stat-value">{stats.totalAnnouncements}</div>
                  <div className="stat-label">Announcements</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎫</div>
                  <div className="stat-value">{stats.activeInvitations}</div>
                  <div className="stat-label">Active Invitations</div>
                </div>
              </div>

              <div className="quick-actions">
                <h3 className="section-subtitle">Quick Actions</h3>
                <div className="quick-actions-grid">
                  <button
                    className="quick-action-btn"
                    onClick={() => navigate('/admin/create-post')}
                  >
                    ➕ Create Post
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => setActiveSection('invitations')}
                  >
                    🎫 Manage Invitations
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => navigate('/feed')}
                  >
                    📰 View Newsfeed
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => navigate('/admin-profile')}
                  >
                    👤 View Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="admin-section">
              <h2 className="section-title">User Management</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            {user.profileImage && (
                              <img src={user.profileImage} alt={user.fullName} className="user-avatar-small" />
                            )}
                            <span>{user.fullName}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn view"
                              onClick={() => navigate(`/profile/${user.id}`)}
                            >
                              View
                            </button>
                            {!user.isAdmin && (
                              <button
                                className="action-btn delete"
                                onClick={() => handleDeleteUser(user.id, user.fullName)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Posts Section */}
          {activeSection === 'posts' && (
            <div className="admin-section">
              <h2 className="section-title">Post Management</h2>
              <div className="admin-list">
                {allPosts.map(post => (
                  <div key={post.id} className="admin-item-card">
                    <div className="admin-item-header">
                      <div className="admin-item-author">
                        {post.authorImage && (
                          <img src={post.authorImage} alt={post.authorName} className="item-avatar" />
                        )}
                        <div>
                          <div className="item-author-name">{post.authorName}</div>
                          <div className="item-date">{formatDate(post.createdAt)}</div>
                        </div>
                      </div>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                    {post.headline && (
                      <div className="item-headline">{post.headline}</div>
                    )}
                    <div className="item-content">{post.content}</div>
                    {post.image && (
                      <img src={post.image} alt="Post" className="item-image" />
                    )}
                    <div className="item-stats">
                      <span>❤️ {post.likes.length}</span>
                      <span>💬 {post.comments.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          {activeSection === 'events' && (
            <div className="admin-section">
              <h2 className="section-title">Event Management</h2>
              <div className="admin-list">
                {allEvents.map(event => (
                  <div key={event.id} className="admin-item-card">
                    <div className="admin-item-header">
                      <div>
                        <div className="item-title">{event.title}</div>
                        <div className="item-date">{formatDate(event.date)}</div>
                        {event.location && <div className="item-location">📍 {event.location}</div>}
                      </div>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="item-content">{event.description}</div>
                    {event.image && (
                      <img src={event.image} alt={event.title} className="item-image" />
                    )}
                    <div className="item-stats">
                      <span>👥 {event.attendees.length} / {event.maxAttendees || '∞'} attendees</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements Section */}
          {activeSection === 'announcements' && (
            <div className="admin-section">
              <h2 className="section-title">Announcement Management</h2>
              <div className="admin-list">
                {allAnnouncements.map(announcement => (
                  <div key={announcement.id} className="admin-item-card">
                    <div className="admin-item-header">
                      <div>
                        <div className="item-title">{announcement.title}</div>
                        <div className="item-date">{formatDate(announcement.date)}</div>
                        <span className={`type-badge ${announcement.type}`}>{announcement.type}</span>
                      </div>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="item-content">{announcement.content}</div>
                    {announcement.image && (
                      <img src={announcement.image} alt={announcement.title} className="item-image" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invitations Section */}
          {activeSection === 'invitations' && (
            <div className="admin-section">
              <h2 className="section-title">Invitation Code Management</h2>
              <div className="admin-list">
                {invitationCodes.map(code => (
                  <div key={code.code} className="admin-item-card">
                    <div className="admin-item-header">
                      <div>
                        <div className="item-title">{code.code}</div>
                        <div className="item-stats">
                          <span>Used: {code.currentUses} / {code.maxUses}</span>
                          {code.expiresAt && (
                            <span>Expires: {formatDate(new Date(code.expiresAt))}</span>
                          )}
                        </div>
                        <span className={`status-badge ${code.isActive ? 'active' : 'inactive'}`}>
                          {code.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="action-buttons">
                        <button
                          className="action-btn copy"
                          onClick={() => {
                            navigator.clipboard.writeText(code.code);
                            alert('Code copied to clipboard!');
                          }}
                        >
                          Copy
                        </button>
                        <button
                          className="action-btn toggle"
                          onClick={async () => {
                            try {
                              await invitationService.updateInvitationCode(code.code, { isActive: !code.isActive });
                              setInvitationCodes(await invitationService.getAllInvitationCodes());
                            } catch (error) {
                              console.error('Error updating invitation code:', error);
                            }
                          }}
                        >
                          {code.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConsolePage;

