import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminUser, adminProfile } from '../data/dummyData';
import { useApp } from '../context/AppContext';
import { userService, postService, eventService, announcementService } from '../services/supabaseService';
import CreatePostModal from '../components/CreatePostModal';
import PostInteractions from '../components/PostInteractions';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import './AdminProfilePage.css';

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const { events, announcements, posts, setPosts, setEvents, setAnnouncements, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'about' | 'friends' | 'events' | 'posts' | 'gallery'>('about');
  const [friends, setFriends] = useState<any[]>([]);
  const [adminPosts, setAdminPosts] = useState<any[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
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
        // Load admin user from database to get actual UUID
        let actualAdminUser = adminUser;
        try {
          const adminFromDb = await userService.getUserByEmail('akiwumi@icloud.com');
          if (adminFromDb) {
            actualAdminUser = adminFromDb;
          }
        } catch (error) {
          console.log('Admin user not found in DB, using default');
        }

        // Load all users (friends) - exclude admin
        const users = await userService.getAllUsers();
        const nonAdminUsers = users.filter(u => u.email !== 'akiwumi@icloud.com');
        setFriends(nonAdminUsers);

        // Load admin posts - check by admin ID or email
        const allPosts = await postService.getPosts();
        const adminPostsData = allPosts.filter(post => 
          post.authorId === adminUser.id || 
          post.authorId === actualAdminUser.id ||
          post.authorName === adminUser.fullName
        );
        setAdminPosts(adminPostsData);

        // Calculate live stats
        const eventsHosted = events.filter(e => 
          e.createdBy === adminUser.id || 
          e.createdBy === actualAdminUser.id ||
          e.createdBy === 'admin-1' ||
          e.createdBy === 'd8750992-cb10-485d-8d45-2746af3db391'
        ).length;
        
        const membersConnected = nonAdminUsers.length;
        
        const yearsActive = Math.max(1, Math.floor((new Date().getTime() - adminProfile.memberSince.getTime()) / (1000 * 60 * 60 * 24 * 365)));
        
        // Extract unique countries from user addresses
        const allUserAddresses = [adminUser.address, ...nonAdminUsers.map(u => u.address)].filter(Boolean);
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
  }, [events, posts]);
  
  const handleFriendClick = (friendId: string) => {
    navigate(`/profile/${friendId}`);
  };
  
  // Filter events created by admin
  const hostedEvents = events.filter(e => {
    const adminIds = [
      adminUser.id,
      'admin-1',
      'd8750992-cb10-485d-8d45-2746af3db391'
    ];
    return adminIds.includes(e.createdBy);
  });

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

  // Hero image - beautiful beach
  const heroImage = '/mallorca-beach.jpg';

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
          alt="Mallorca beach"
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
          
          <div className="admin-name-row">
            <h1 className="admin-name">{adminUser.fullName}</h1>
            <button className="add-friend-btn" title="Add Friend">
              <img src="/add.png" alt="Add Friend" className="add-friend-icon" />
            </button>
          </div>
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

          {/* Contact Button */}
          <button className="contact-admin-btn">
            💬 Message Pernilla
          </button>
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
          </div>
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

          {activeTab === 'friends' && (
            <div className="friends-section">
              <div className="friends-header">
                <h2 className="friends-title">Friends ({friends.length})</h2>
                <span className="friends-subtitle">All members connected with Pernilla</span>
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
                <h2 className="posts-title">Posts by Pernilla</h2>
                <div className="posts-header-right">
                  <span className="posts-count">{stats.postsCount} {stats.postsCount === 1 ? 'post' : 'posts'}</span>
                  <button 
                    className="create-post-btn"
                    onClick={() => setShowCreatePost(true)}
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
                                p.authorId === adminUser.id || 
                                p.authorId === currentUser.id ||
                                p.authorName === adminUser.fullName
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
                                p.authorId === adminUser.id || 
                                p.authorId === currentUser.id ||
                                p.authorName === adminUser.fullName
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
                                p.authorId === adminUser.id || 
                                p.authorId === currentUser.id ||
                                p.authorName === adminUser.fullName
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
                              'PRODID:-//Rendezvous Social Club//EN',
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
      
      {/* Create Post Modal */}
      {currentUser && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSubmit={async (postData) => {
            try {
              // Create post in Supabase
              await postService.createPost({
                ...postData,
                id: `post-${Date.now()}`,
                createdAt: new Date(),
              } as any);
              
              // If it's an event or announcement, create those too
              if (postData.postType === 'event' && postData.eventDate) {
                await eventService.createEvent({
                  id: `evt-${Date.now()}`,
                  title: postData.headline || 'New Event',
                  description: postData.content || '',
                  image: postData.image,
                  date: postData.eventDate,
                  location: postData.location,
                  attendees: [],
                  createdBy: currentUser.id,
                });
              } else if (postData.postType === 'announcement' && postData.eventDate) {
                await announcementService.createAnnouncement({
                  id: `ann-${Date.now()}`,
                  title: postData.headline || 'New Announcement',
                  content: postData.content || '',
                  image: postData.image,
                  date: postData.eventDate.toISOString(),
                  type: 'event',
                  created_by: currentUser.id,
                });
              }
              
              // Reload posts
              const updatedPosts = await postService.getPosts();
              setPosts(updatedPosts);
              
              // Reload events and announcements if needed
              if (postData.postType === 'event') {
                const updatedEvents = await eventService.getEvents();
                setEvents(updatedEvents);
              } else if (postData.postType === 'announcement') {
                const updatedAnnouncements = await announcementService.getAnnouncements();
                setAnnouncements(updatedAnnouncements);
              }
            } catch (error) {
              console.error('Error creating post:', error);
              alert('Failed to create post. Please try again.');
            }
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default AdminProfilePage;

