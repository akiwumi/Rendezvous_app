import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userService, postService } from '../services/localDataService';
import { User } from '../types';
import AppHeader from '../components/AppHeader';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const { currentUser, events, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState<'about' | 'friends' | 'posts' | 'events' | 'reminders'>('about');
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = (authorId: string) => {
    const admin = adminUser || allUsers.find(u => u.isAdmin);
    if (admin && authorId === admin.id) {
      navigate('/admin-profile');
    } else {
      navigate(`/profile/${authorId}`);
    }
  };

  const handleFriendClick = (friendId: string) => {
    const admin = adminUser || allUsers.find(u => u.isAdmin);
    if (admin && friendId === admin.id) {
      navigate('/admin-profile');
    } else {
      navigate(`/profile/${friendId}`);
    }
  };

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load admin user from database
        try {
          const admin = await userService.getUserByEmail('akiwumi@gmail.com');
          if (admin && admin.isAdmin) {
            setAdminUser(admin);
          }
        } catch (error) {
          console.error('Error loading admin user:', error);
        }

        // Load all users
        const users = await userService.getAllUsers();
        setAllUsers(users);

        // Find admin in users list
        const foundAdmin = users.find(u => u.isAdmin && u.email === 'akiwumi@gmail.com');
        if (foundAdmin) {
          setAdminUser(foundAdmin);
        }

        // Load profile user
        if (userId) {
          // Check if it's admin by ID or email
          const isAdminId = userId === 'admin-1' || userId === foundAdmin?.id || userId === adminUser?.id;
          if (isAdminId && (foundAdmin || adminUser)) {
            setProfileUser(foundAdmin || adminUser);
          } else {
            try {
              const user = await userService.getUser(userId);
              if (user) {
                // Double check if this user is admin
                if (user.isAdmin && user.email === 'akiwumi@gmail.com') {
                  navigate('/admin-profile');
                  return;
                }
                setProfileUser(user);
              } else {
                // User not found, try to find by email
                const userByEmail = users.find(u => u.email === userId);
                if (userByEmail) {
                  if (userByEmail.isAdmin) {
                    navigate('/admin-profile');
                    return;
                  }
                  setProfileUser(userByEmail);
                } else {
                  setProfileUser(currentUser || foundAdmin || null);
                }
              }
            } catch (error) {
              console.error('Error loading user:', error);
              // Try to find user in the loaded users list
              const userInList = users.find(u => u.id === userId);
              if (userInList) {
                setProfileUser(userInList);
              } else {
                setProfileUser(currentUser || foundAdmin || null);
              }
            }
          }
        } else {
          setProfileUser(currentUser || foundAdmin || adminUser || null);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUserData();
  }, [userId, currentUser, adminUser]);

  // Load liked posts
  useEffect(() => {
    if (profileUser?.likedPosts && profileUser.likedPosts.length > 0) {
      const loadLikedPosts = async () => {
        try {
          const postPromises = profileUser.likedPosts!.map(postId => 
            postService.getPost(postId).catch(() => null)
          );
          const loadedPosts = await Promise.all(postPromises);
          setLikedPosts(loadedPosts.filter(p => p !== null));
        } catch (error) {
          console.error('Error loading liked posts:', error);
        }
      };
      loadLikedPosts();
    }
  }, [profileUser]);

  const profile = profileUser;
  const admin = adminUser || allUsers.find(u => u.isAdmin);
  const isAdmin = profile?.isAdmin || (admin && profile?.id === admin.id);

  // Get friend user objects
  const friends = profile.friends
    .map(friendId => allUsers.find(u => u.id === friendId))
    .filter((friend): friend is typeof adminUser => friend !== undefined);
  
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

  // Check if viewing own profile (user is logged in and viewing their own profile)
  // Allow updates for non-admin profiles only (admin profile is managed separately)
  const isOwnProfile = currentUser && profile && currentUser.id === profile.id && (!admin || profile.id !== admin.id);

  const handleImageClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Convert image to base64 data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;
          
          // Update user profile with new image
          const updatedUser = await updateUser(currentUser.id, {
            profileImage: base64Image,
          });

          // Update local state
          setProfileUser(updatedUser);

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to update profile image. Please try again.');
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.onerror = () => {
        setIsUploadingImage(false);
        alert('Error reading image file. Please try again.');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setIsUploadingImage(false);
      alert('Failed to process image. Please try again.');
    }
  };

  // Dummy hero image for profile - Mallorca landscape
  const profileHeroImage = 'https://www.cunard.com/content/dam/cunard/marketing-assets/cunard-stories/mediterranean/Mediterranean_Beach_1480x832.jpg.image.1480.832.low.jpg';

  if (!profile) {
    return (
      <div className="profile-page">
        <AppHeader />
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>
      </div>
    );
  }

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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className={`profile-image ${isOwnProfile ? 'editable' : ''}`}
              />
            ) : (
              <div className={`profile-image-placeholder ${isOwnProfile ? 'editable' : ''}`}>
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            {isOwnProfile && (
              <button
                className="profile-image-upload-btn"
                onClick={handleImageClick}
                disabled={isUploadingImage}
                title="Change profile picture"
              >
                {isUploadingImage ? (
                  <span className="upload-spinner">⏳</span>
                ) : (
                  <span className="camera-icon">📷</span>
                )}
              </button>
            )}
          </div>
          <div className="profile-name-row">
            <h1 className="profile-name">
              {profile.fullName}
              {isAdmin && <span className="admin-badge">Admin</span>}
            </h1>
            <div className="profile-actions">
              {isAdmin && currentUser?.isAdmin && (
                <button 
                  className="profile-action-btn admin-console-btn"
                  onClick={() => navigate('/admin-console')}
                  title="Admin Console"
                >
                  ⚙️ Console
                </button>
              )}
              <button 
                className="profile-action-btn feed-btn"
                onClick={() => navigate('/feed')}
                title="View Newsfeed"
              >
                📰 Feed
              </button>
              {!isAdmin && currentUser && currentUser.id !== profile.id && (
                <button className="add-friend-btn" title="Add Friend">
                  <img src="/add.png" alt="Add Friend" className="add-friend-icon" />
                </button>
              )}
            </div>
          </div>
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
            title="About"
          >
            <img src="/info.png" alt="About" className="tab-icon" />
          </button>
          <button
            className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
            title={`Friends (${friends.length})`}
          >
            <img src="/friends.png" alt="Friends" className="tab-icon" />
            <span className="friends-count">{friends.length}</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
            title="Liked Posts"
          >
            <img src="/heart.png" alt="Liked Posts" className="tab-icon" />
          </button>
          <button
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
            title="My Events"
          >
            <img src="/calendar-check.png" alt="My Events" className="tab-icon" />
          </button>
          <button
            className={`tab-button ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminders')}
            title="Reminders"
          >
            <img src="/bell.png" alt="Reminders" className="tab-icon" />
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

              {(profile.bio || isAdmin) && (
                <div className="detail-section">
                  <h2 className="section-title">About</h2>
                  <p className="profile-bio">
                    {profile.bio || (isAdmin && `Welcome to Rendezvous Social Club! As the administrator, I'm here to ensure
                    all members have an exceptional experience. Feel free to reach out with any
                    questions, suggestions, or concerns. Let's make this community thrive together!`)}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="friends-section">
              <h2 className="section-title">Friends ({friends.length})</h2>
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
                      {friend.isAdmin && (
                        <span className="friend-admin-badge">Admin</span>
                      )}
                    </div>
                  ))}
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
                            <img 
                              src={post.authorImage} 
                              alt={post.authorName} 
                              className={`mini-avatar ${post.authorId === 'admin-1' ? 'clickable' : ''}`}
                              onClick={() => handleProfileClick(post.authorId)}
                              style={post.authorId === 'admin-1' ? { cursor: 'pointer' } : {}}
                            />
                          ) : (
                            <div 
                              className={`mini-avatar-placeholder ${post.authorId === 'admin-1' ? 'clickable' : ''}`}
                              onClick={() => post.authorId === 'admin-1' && handleProfileClick(post.authorId)}
                              style={post.authorId === 'admin-1' ? { cursor: 'pointer' } : {}}
                            >
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
