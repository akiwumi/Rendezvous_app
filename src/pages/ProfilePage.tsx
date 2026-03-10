import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userService, postService, storageService } from '../services/localDataService';
import { User } from '../types';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const { currentUser, events, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState<'about' | 'friends' | 'posts' | 'events'>('about');
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
    address: '',
    phone: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
  });
  const [isSaving, setIsSaving] = useState(false);
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

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const users = await userService.getAllUsers();
        setAllUsers(users);

        const foundAdmin = users.find(u => u.isAdmin);
        if (foundAdmin) setAdminUser(foundAdmin);

        if (userId) {
          const isAdminId = userId === foundAdmin?.id;
          if (isAdminId && foundAdmin) {
            setProfileUser(foundAdmin);
          } else {
            try {
              const user = await userService.getUser(userId);
              if (user) {
                if (user.isAdmin) {
                  navigate('/admin-profile');
                  return;
                }
                setProfileUser(user);
              } else {
                const userInList = users.find(u => u.id === userId || u.email === userId);
                setProfileUser(userInList || currentUser || null);
              }
            } catch {
              const userInList = users.find(u => u.id === userId);
              setProfileUser(userInList || currentUser || null);
            }
          }
        } else {
          setProfileUser(currentUser || foundAdmin || null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, currentUser]);

  useEffect(() => {
    if (profileUser?.likedPosts && profileUser.likedPosts.length > 0) {
      const loadLikedPosts = async () => {
        try {
          const postPromises = profileUser.likedPosts!.map(postId =>
            postService.getPost(postId).catch(() => null)
          );
          const loaded = await Promise.all(postPromises);
          setLikedPosts(loaded.filter(Boolean));
        } catch (error) {
          console.error('Error loading liked posts:', error);
        }
      };
      loadLikedPosts();
    }
  }, [profileUser]);

  const handleImageClick = () => {
    if (isOwnProfile && fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, or WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10MB. Please choose a smaller file.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await storageService.uploadAvatar(file, currentUser.id);
      await updateUser(currentUser.id, { profileImage: url });
      setProfileUser(prev => prev ? { ...prev, profileImage: url } : prev);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      console.error('Profile image upload error:', err);
      alert(`Failed to upload profile image: ${msg}. Make sure storage buckets are set up in Supabase (see supabase/migrations).`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    }).format(new Date(date));

  if (loading) {
    return (
      <div className="profile-page profile-loading">
        <div className="profile-loading-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-page profile-loading">
        <p style={{ color: 'var(--text-secondary)' }}>Profile not found.</p>
        <button className="profile-back-btn" onClick={() => navigate('/feed')}>← Back to Feed</button>
      </div>
    );
  }

  const profile = profileUser;
  const admin = adminUser || allUsers.find(u => u.isAdmin);
  const isAdmin = profile.isAdmin || (admin && profile.id === admin.id);
  const isOwnProfile = currentUser && profile && currentUser.id === profile.id && !(admin && profile.id === admin.id);

  const friends = (profile.friends || [])
    .map(friendId => allUsers.find(u => u.id === friendId))
    .filter((f): f is User => !!f);

  const registeredEvents = events.filter(event =>
    currentUser?.registeredEvents?.includes(event.id) ||
    event.attendees.includes(profile.id)
  );

  const isFriend = currentUser ? (currentUser.friends || []).includes(profile.id) : false;

  const handleFriendToggle = async () => {
    if (!currentUser) return;
    try {
      const updated = isFriend
        ? await userService.removeFriend(currentUser.id, profile.id)
        : await userService.addFriend(currentUser.id, profile.id);
      // Sync context so Stories carousel re-renders with updated friends list
      await updateUser(currentUser.id, { friends: updated.friends });
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, friends: updated.friends } : u));
    } catch (error) {
      console.error('Friend toggle error:', error);
    }
  };

  const startEditing = () => {
    setEditForm({
      fullName: profile.fullName || '',
      bio: profile.bio || '',
      address: profile.address || '',
      phone: profile.phone || '',
      instagram: profile.socialLinks?.instagram || '',
      facebook: profile.socialLinks?.facebook || '',
      twitter: profile.socialLinks?.twitter || '',
      linkedin: profile.socialLinks?.linkedin || '',
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!currentUser || currentUser.id !== profile.id) return;
    setIsSaving(true);
    try {
      const socialLinks: Record<string, string> = {};
      if (editForm.instagram.trim()) socialLinks.instagram = editForm.instagram.trim();
      if (editForm.facebook.trim()) socialLinks.facebook = editForm.facebook.trim();
      if (editForm.twitter.trim()) socialLinks.twitter = editForm.twitter.trim();
      if (editForm.linkedin.trim()) socialLinks.linkedin = editForm.linkedin.trim();
      const updates: Partial<User> = {
        fullName: editForm.fullName.trim(),
        bio: editForm.bio.trim() || undefined,
        address: editForm.address.trim() || undefined,
        phone: editForm.phone.trim() || undefined,
        socialLinks: Object.keys(socialLinks).length ? socialLinks : undefined,
      };
      const updated = await updateUser(profile.id, updates);
      setProfileUser(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Save profile error:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Hero - gradient background, no hardcoded image */}
      <div className="profile-hero profile-hero-gradient">
        <div className="profile-hero-overlay" />

        {/* Back button */}
        <button className="profile-back-btn-overlay" onClick={() => navigate(-1)}>
          ‹
        </button>

        {/* Top user badge */}
        <div className="profile-hero-top">
          <div className="profile-hero-user">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.fullName} className="profile-hero-avatar" />
            ) : (
              <div className="profile-hero-avatar profile-hero-avatar-placeholder">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="profile-hero-username">@{profile.fullName.replace(/\s+/g, '').toLowerCase()}</p>
              <p className="profile-hero-tagline">{isAdmin ? 'Administrator' : 'Member'}</p>
            </div>
          </div>
          {isAdmin && currentUser?.isAdmin && (
            <button className="profile-console-btn" onClick={() => navigate('/admin-console')}>
              ⚙
            </button>
          )}
        </div>

        {/* Bottom quote / bio area */}
        <div className="profile-hero-bottom">
          {profile.bio && (
            <>
              <div className="profile-hero-quote">
                <span className="quote-mark">"</span>
              </div>
              <p className="profile-hero-quote-text">{profile.bio}</p>
            </>
          )}
        </div>
      </div>

      {/* White card slides up over hero */}
      <div className="profile-card">
        {/* Avatar + name row */}
        <div className="profile-identity">
          <div className="profile-avatar-wrap">
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
                className={`profile-avatar-large ${isOwnProfile ? 'editable' : ''}`}
                onClick={handleImageClick}
              />
            ) : (
              <div
                className={`profile-avatar-large profile-avatar-placeholder ${isOwnProfile ? 'editable profile-avatar-add-photo' : ''}`}
                onClick={handleImageClick}
              >
                {isOwnProfile ? (
                  <span className="profile-avatar-add-content">
                    <span className="profile-avatar-add-icon">📷</span>
                    <span className="profile-avatar-add-text">Add photo</span>
                  </span>
                ) : (
                  profile.fullName.charAt(0).toUpperCase()
                )}
              </div>
            )}
            {isOwnProfile && (
              <button
                className="profile-camera-btn"
                onClick={handleImageClick}
                disabled={isUploadingImage}
                title={profile.profileImage ? 'Change photo' : 'Upload photo'}
                aria-label={profile.profileImage ? 'Change profile photo' : 'Upload profile photo'}
              >
                {isUploadingImage ? '⏳' : '📷'}
              </button>
            )}
          </div>

          <div className="profile-identity-info">
            <h1 className="profile-display-name">
              {profile.fullName}
              {isAdmin && <span className="profile-admin-chip">Admin</span>}
            </h1>
            {profile.address && !isEditing && (
              <p className="profile-address">📍 {profile.address}</p>
            )}
            {isOwnProfile && (
              <div className="profile-identity-buttons">
                <button
                  className="profile-change-photo-btn"
                  onClick={handleImageClick}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? 'Uploading…' : (profile.profileImage ? 'Change photo' : 'Upload photo')}
                </button>
                <button
                  className="profile-edit-btn"
                  onClick={isEditing ? cancelEditing : startEditing}
                >
                  {isEditing ? 'Cancel' : 'Edit profile'}
                </button>
              </div>
            )}
          </div>

          {/* Add friend / feed action */}
          <div className="profile-identity-actions">
            {!isAdmin && currentUser && currentUser.id !== profile.id && (
              <button
                className={`profile-follow-btn${isFriend ? ' connected' : ''}`}
                onClick={handleFriendToggle}
              >
                {isFriend ? '✓ Connected' : '+ Connect'}
              </button>
            )}
            <button className="profile-feed-btn" onClick={() => navigate('/feed')}>
              Feed
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="profile-stats-row">
          <div className="profile-stat">
            <span className="profile-stat-val">{friends.length}</span>
            <span className="profile-stat-lbl">Connections</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-val">{likedPosts.length}</span>
            <span className="profile-stat-lbl">Liked</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-val">{registeredEvents.length}</span>
            <span className="profile-stat-lbl">Events</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          {(['about', 'friends', 'posts', 'events'] as const).map(tab => (
            <button
              key={tab}
              className={`profile-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'about' && 'About'}
              {tab === 'friends' && `Connections${friends.length ? ` (${friends.length})` : ''}`}
              {tab === 'posts' && 'Liked'}
              {tab === 'events' && 'Events'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="profile-tab-content">

          {/* ABOUT */}
          {activeTab === 'about' && (
            <div className="profile-section-list">
              {isOwnProfile && isEditing ? (
                <div className="profile-edit-form">
                  <div className="profile-info-card">
                    <h3 className="profile-info-title">Name</h3>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                      className="profile-edit-input"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="profile-info-card">
                    <h3 className="profile-info-title">Bio</h3>
                    <textarea
                      value={editForm.bio}
                      onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                      className="profile-edit-textarea"
                      placeholder="About you"
                      rows={4}
                    />
                  </div>
                  <div className="profile-info-card">
                    <h3 className="profile-info-title">Contact</h3>
                    <div className="profile-edit-row">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                        className="profile-edit-input"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="profile-edit-row">
                      <label>Address</label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}
                        className="profile-edit-input"
                        placeholder="Address"
                      />
                    </div>
                  </div>
                  <div className="profile-info-card">
                    <h3 className="profile-info-title">Social</h3>
                    <div className="profile-edit-row">
                      <label>Instagram</label>
                      <input
                        type="text"
                        value={editForm.instagram}
                        onChange={e => setEditForm(f => ({ ...f, instagram: e.target.value }))}
                        className="profile-edit-input"
                        placeholder="@username"
                      />
                    </div>
                    <div className="profile-edit-row">
                      <label>Facebook</label>
                      <input
                        type="text"
                        value={editForm.facebook}
                        onChange={e => setEditForm(f => ({ ...f, facebook: e.target.value }))}
                        className="profile-edit-input"
                        placeholder="Facebook URL"
                      />
                    </div>
                    <div className="profile-edit-row">
                      <label>Twitter</label>
                      <input
                        type="text"
                        value={editForm.twitter}
                        onChange={e => setEditForm(f => ({ ...f, twitter: e.target.value }))}
                        className="profile-edit-input"
                        placeholder="@username"
                      />
                    </div>
                    <div className="profile-edit-row">
                      <label>LinkedIn</label>
                      <input
                        type="text"
                        value={editForm.linkedin}
                        onChange={e => setEditForm(f => ({ ...f, linkedin: e.target.value }))}
                        className="profile-edit-input"
                        placeholder="LinkedIn URL"
                      />
                    </div>
                  </div>
                  <div className="profile-edit-actions">
                    <button className="profile-save-btn" onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button className="profile-cancel-btn" onClick={cancelEditing}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="profile-info-card">
                    <h3 className="profile-info-title">Contact</h3>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Email</span>
                      <span className="profile-info-value">{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="profile-info-row">
                        <span className="profile-info-label">Phone</span>
                        <span className="profile-info-value">{profile.phone}</span>
                      </div>
                    )}
                    {profile.address && (
                      <div className="profile-info-row">
                        <span className="profile-info-label">Address</span>
                        <span className="profile-info-value">{profile.address}</span>
                      </div>
                    )}
                  </div>

                  {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
                    <div className="profile-info-card">
                      <h3 className="profile-info-title">Social</h3>
                      {profile.socialLinks.instagram && (
                        <div className="profile-info-row">
                          <span className="profile-info-label">Instagram</span>
                          <span className="profile-info-value">{profile.socialLinks.instagram}</span>
                        </div>
                      )}
                      {profile.socialLinks.facebook && (
                        <div className="profile-info-row">
                          <span className="profile-info-label">Facebook</span>
                          <span className="profile-info-value">{profile.socialLinks.facebook}</span>
                        </div>
                      )}
                      {profile.socialLinks.twitter && (
                        <div className="profile-info-row">
                          <span className="profile-info-label">Twitter</span>
                          <span className="profile-info-value">{profile.socialLinks.twitter}</span>
                        </div>
                      )}
                      {profile.socialLinks.linkedin && (
                        <div className="profile-info-row">
                          <span className="profile-info-label">LinkedIn</span>
                          <span className="profile-info-value">{profile.socialLinks.linkedin}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {profile.bio && (
                    <div className="profile-info-card">
                      <h3 className="profile-info-title">Bio</h3>
                      <p className="profile-bio-text">{profile.bio}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* FRIENDS */}
          {activeTab === 'friends' && (
            <div>
              {friends.length === 0 ? (
                <div className="profile-empty">
                  <span>👥</span>
                  <p>No connections yet</p>
                </div>
              ) : (
                <div className="profile-friends-grid">
                  {friends.map(friend => (
                    <div key={friend.id} className="profile-friend-card" onClick={() => handleFriendClick(friend.id)}>
                      {friend.profileImage ? (
                        <img src={friend.profileImage} alt={friend.fullName} className="profile-friend-avatar" />
                      ) : (
                        <div className="profile-friend-avatar profile-friend-avatar-placeholder">
                          {friend.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="profile-friend-name">{friend.fullName}</span>
                      {friend.isAdmin && <span className="profile-friend-admin">Admin</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LIKED POSTS */}
          {activeTab === 'posts' && (
            <div>
              {likedPosts.length === 0 ? (
                <div className="profile-empty">
                  <span>❤️</span>
                  <p>No liked posts yet</p>
                </div>
              ) : (
                <div className="profile-posts-list">
                  {likedPosts.map(post => (
                    <div key={post.id} className="profile-post-card">
                      {post.image && (
                        <div className="profile-post-image">
                          <img src={post.image} alt="Post" />
                        </div>
                      )}
                      <div className="profile-post-body">
                        <div className="profile-post-author" onClick={() => handleProfileClick(post.authorId)}>
                          {post.authorImage ? (
                            <img src={post.authorImage} alt={post.authorName} className="profile-post-avatar" />
                          ) : (
                            <div className="profile-post-avatar profile-post-avatar-placeholder">
                              {post.authorName.charAt(0)}
                            </div>
                          )}
                          <span>{post.authorName}</span>
                        </div>
                        <p className="profile-post-text">{post.content.substring(0, 100)}…</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EVENTS */}
          {activeTab === 'events' && (
            <div>
              {registeredEvents.length === 0 ? (
                <div className="profile-empty">
                  <span>📅</span>
                  <p>No registered events yet</p>
                </div>
              ) : (
                <div className="profile-events-list">
                  {registeredEvents.map(event => (
                    <div key={event.id} className="profile-event-card">
                      {event.image && (
                        <div className="profile-event-image">
                          <img src={event.image} alt={event.title} />
                        </div>
                      )}
                      <div className="profile-event-body">
                        <h4 className="profile-event-title">{event.title}</h4>
                        <p className="profile-event-date">📅 {formatDate(event.date)}</p>
                        {event.location && <p className="profile-event-location">📍 {event.location}</p>}
                        <span className="profile-event-badge">Registered</span>
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
