import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { adminUser, dummyPosts } from '../data/dummyData';
import AppHeader from '../components/AppHeader';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, events } = useApp();
  const [activeTab, setActiveTab] = useState<'about' | 'posts' | 'events' | 'reminders'>('about');
  
  const profile = currentUser || adminUser;
  const isAdmin = profile.isAdmin || profile.id === adminUser.id;

  // Dummy liked posts
  const likedPosts = dummyPosts.slice(0, 2);
  
  // User's registered events
  const registeredEvents = events.filter(event => 
    currentUser?.registeredEvents?.includes(event.id) || 
    event.attendees.includes(profile.id)
  );

  // Dummy event reminders
  const eventReminders = [
    {
      eventId: 'evt-1',
      eventTitle: 'Wine Tasting Evening',
      eventDate: new Date('2025-06-25T19:00:00'),
      reminderTime: new Date('2025-06-25T17:00:00'),
      notified: false,
    },
    {
      eventId: 'evt-2',
      eventTitle: 'Yacht Day Trip',
      eventDate: new Date('2025-07-02T10:00:00'),
      reminderTime: new Date('2025-07-02T08:00:00'),
      notified: false,
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatReminderTime = (date: Date) => {
    const now = new Date();
    const reminderDate = new Date(date);
    const diff = reminderDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diff < 0) return 'Past';
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `In ${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Soon';
  };

  // Dummy hero image for profile - Mallorca landscape
  const profileHeroImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';

  return (
    <div className="profile-page">
      <AppHeader />
      
      {/* Profile Hero Section */}
      <div className="profile-hero">
        <img 
          src={profileHeroImage}
          alt="Profile background"
          className="profile-hero-image"
        />
        <div className="profile-hero-overlay"></div>
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-image-container">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="profile-name">
            {profile.fullName}
            {isAdmin && <span className="admin-badge">Admin</span>}
          </h1>
          {profile.address && (
            <p className="profile-location">📍 {profile.address}</p>
          )}
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{profile.friends.length}</span>
              <span className="stat-label">Friends</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{likedPosts.length}</span>
              <span className="stat-label">Liked</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{registeredEvents.length}</span>
              <span className="stat-label">Events</span>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Liked Posts
          </button>
          <button
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            My Events
          </button>
          <button
            className={`tab-button ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            Reminders
          </button>
        </div>

        <div className="profile-tab-content">
          {activeTab === 'about' && (
            <div className="profile-details">
              <div className="detail-section">
                <h2 className="section-title">Contact Information</h2>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{profile.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{profile.phone}</span>
                </div>
              </div>

              {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                <div className="detail-section">
                  <h2 className="section-title">Social Links</h2>
                  {profile.socialLinks.instagram && (
                    <div className="detail-item">
                      <span className="detail-label">Instagram</span>
                      <span className="detail-value">{profile.socialLinks.instagram}</span>
                    </div>
                  )}
                  {profile.socialLinks.facebook && (
                    <div className="detail-item">
                      <span className="detail-label">Facebook</span>
                      <span className="detail-value">{profile.socialLinks.facebook}</span>
                    </div>
                  )}
                  {profile.socialLinks.twitter && (
                    <div className="detail-item">
                      <span className="detail-label">Twitter</span>
                      <span className="detail-value">{profile.socialLinks.twitter}</span>
                    </div>
                  )}
                  {profile.socialLinks.linkedin && (
                    <div className="detail-item">
                      <span className="detail-label">LinkedIn</span>
                      <span className="detail-value">{profile.socialLinks.linkedin}</span>
                    </div>
                  )}
                </div>
              )}

              {isAdmin && (
                <div className="detail-section">
                  <h2 className="section-title">About</h2>
                  <p className="profile-bio">
                    Welcome to Rendezvous Social Club! As the administrator, I'm here to ensure
                    all members have an exceptional experience. Feel free to reach out with any
                    questions, suggestions, or concerns. Let's make this community thrive together!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="liked-posts-section">
              <h2 className="section-title">Liked Posts ({likedPosts.length})</h2>
              {likedPosts.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">❤️</span>
                  <p>No liked posts yet</p>
                </div>
              ) : (
                <div className="posts-grid">
                  {likedPosts.map((post) => (
                    <div key={post.id} className="post-card-mini">
                      {post.image && (
                        <div className={`post-mini-image ${post.authorId === 'admin-1' ? 'has-admin-watermark' : ''}`}>
                          <img src={post.image} alt="Post" />
                        </div>
                      )}
                      <div className="post-mini-content">
                        <div className="post-mini-author">
                          {post.authorImage ? (
                            <img src={post.authorImage} alt={post.authorName} className="mini-avatar" />
                          ) : (
                            <div className="mini-avatar-placeholder">
                              {post.authorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span>{post.authorName}</span>
                        </div>
                        <p className="post-mini-text">{post.content.substring(0, 100)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-section">
              <h2 className="section-title">Registered Events ({registeredEvents.length})</h2>
              {registeredEvents.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📅</span>
                  <p>No registered events yet</p>
                </div>
              ) : (
                <div className="events-list">
                  {registeredEvents.map((event) => (
                    <div key={event.id} className="event-card-mini">
                      {event.image && (
                        <div className="event-mini-image">
                          <img src={event.image} alt={event.title} />
                        </div>
                      )}
                      <div className="event-mini-content">
                        <h3 className="event-mini-title">{event.title}</h3>
                        <p className="event-mini-date">📅 {formatDate(event.date)}</p>
                        {event.location && (
                          <p className="event-mini-location">📍 {event.location}</p>
                        )}
                        <span className="event-status-badge">Registered</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="reminders-section">
              <h2 className="section-title">Event Reminders ({eventReminders.length})</h2>
              <p className="reminders-subtitle">
                You'll receive notifications before your registered events
              </p>
              {eventReminders.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">⏰</span>
                  <p>No reminders set</p>
                </div>
              ) : (
                <div className="reminders-list">
                  {eventReminders.map((reminder, index) => (
                    <div key={index} className="reminder-card">
                      <div className="reminder-icon">⏰</div>
                      <div className="reminder-content">
                        <h3 className="reminder-title">{reminder.eventTitle}</h3>
                        <div className="reminder-details">
                          <p className="reminder-event-date">
                            Event: {formatDate(reminder.eventDate)}
                          </p>
                          <p className="reminder-time">
                            Reminder: {formatDate(reminder.reminderTime)}
                          </p>
                        </div>
                        <div className="reminder-status">
                          <span className={`reminder-badge ${reminder.notified ? 'notified' : 'pending'}`}>
                            {reminder.notified ? '✓ Notified' : formatReminderTime(reminder.reminderTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
