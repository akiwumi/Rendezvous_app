import { useState } from 'react';
import { adminUser, adminProfile, dummyPosts, dummyEvents, dummyAnnouncements } from '../data/dummyData';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import './AdminProfilePage.css';

const AdminProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'posts' | 'gallery'>('about');

  // Admin's posts
  const adminPosts = dummyPosts.filter(post => post.authorId === adminUser.id);
  
  // All events (admin created all)
  const hostedEvents = dummyEvents;

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

  // Hero image - beautiful Mallorca sunset/landscape
  const heroImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200';

  // Gallery images
  const galleryImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600', caption: 'Summer Gala 2024' },
    { id: 2, src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600', caption: 'Yacht Day Trip' },
    { id: 3, src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600', caption: 'Wine Tasting Evening' },
    { id: 4, src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600', caption: 'Art Exhibition Opening' },
    { id: 5, src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600', caption: 'Anniversary Gala' },
    { id: 6, src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', caption: 'Club Facilities' },
  ];

  return (
    <div className="admin-profile-page">
      <AppHeader />
      
      {/* Hero Section */}
      <div className="admin-hero">
        <img 
          src={heroImage}
          alt="Mallorca landscape"
          className="admin-hero-image"
        />
        <div className="admin-hero-overlay"></div>
        <div className="admin-hero-content">
          <span className="admin-hero-badge">Club Administrator</span>
        </div>
      </div>

      <div className="admin-profile-content">
        {/* Profile Header */}
        <div className="admin-profile-header">
          <div className="admin-avatar-container">
            <img
              src={adminUser.profileImage}
              alt={adminUser.fullName}
              className="admin-avatar"
            />
            <div className="admin-verified-badge">✓</div>
          </div>
          
          <h1 className="admin-name">{adminUser.fullName}</h1>
          <p className="admin-role">{adminProfile.role}</p>
          <p className="admin-location">📍 {adminUser.address}</p>
          
          <div className="admin-quote">
            <span className="quote-mark">"</span>
            {adminProfile.quote.replace(/"/g, '')}
            <span className="quote-mark">"</span>
          </div>

          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-value">{adminProfile.stats.eventsHosted}</span>
              <span className="admin-stat-label">Events Hosted</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{adminProfile.stats.membersConnected}</span>
              <span className="admin-stat-label">Members</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{adminProfile.stats.yearsActive}</span>
              <span className="admin-stat-label">Years Active</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{adminProfile.stats.countriesRepresented}</span>
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

          {/* Contact Button */}
          <button className="contact-admin-btn">
            💬 Message Pernilla
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
        </div>

        {/* Tab Content */}
        <div className="admin-tab-content">
          {activeTab === 'about' && (
            <div className="about-section">
              {/* Bio */}
              <div className="about-card">
                <h2 className="about-card-title">About Pernilla</h2>
                <p className="admin-bio">{adminProfile.bio}</p>
                <p className="member-since">
                  <span className="member-since-label">Member since</span>
                  <span className="member-since-value">{formatMemberSince(adminProfile.memberSince)}</span>
                </p>
              </div>

              {/* Achievements */}
              <div className="about-card">
                <h2 className="about-card-title">🏆 Achievements</h2>
                <ul className="achievements-list">
                  {adminProfile.achievements.map((achievement, index) => (
                    <li key={index} className="achievement-item">
                      <span className="achievement-bullet">✦</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interests */}
              <div className="about-card">
                <h2 className="about-card-title">💫 Interests</h2>
                <div className="interests-grid">
                  {adminProfile.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="about-card">
                <h2 className="about-card-title">🌍 Languages</h2>
                <div className="languages-list">
                  {adminProfile.languages.map((language, index) => (
                    <span key={index} className="language-badge">{language}</span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="about-card">
                <h2 className="about-card-title">📞 Contact Information</h2>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <span className="contact-value">{adminUser.email}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <span className="contact-value">{adminUser.phone}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <span className="contact-value">{adminUser.address}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-section">
              <div className="events-header">
                <h2 className="events-title">Hosted Events</h2>
                <span className="events-count">{hostedEvents.length} events</span>
              </div>
              
              {/* Upcoming Events */}
              <div className="events-category">
                <h3 className="category-title">Upcoming Events</h3>
                <div className="admin-events-list">
                  {hostedEvents.map((event) => (
                    <div key={event.id} className="admin-event-card">
                      <div className="admin-event-image has-admin-watermark">
                        <img src={event.image} alt={event.title} />
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
                  {dummyAnnouncements.slice(0, 3).map((announcement) => (
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
                <h2 className="posts-title">Posts by Pernilla</h2>
                <span className="posts-count">{adminPosts.length} posts</span>
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
                        <img src={adminUser.profileImage} alt={adminUser.fullName} className="post-author-avatar" />
                        <div className="post-author-info">
                          <span className="post-author-name">{adminUser.fullName}</span>
                          <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="post-text">{post.content}</p>
                      <div className="post-actions">
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
                <span className="gallery-count">{galleryImages.length} photos</span>
              </div>
              
              <div className="gallery-grid">
                {galleryImages.map((image) => (
                  <div key={image.id} className="gallery-item">
                    <img src={image.src} alt={image.caption} />
                    <div className="gallery-caption">{image.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AdminProfilePage;

