import { useApp } from '../context/AppContext';
import { adminUser } from '../data/dummyData';
import AppHeader from '../components/AppHeader';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser } = useApp();
  const profile = currentUser || adminUser;
  const isAdmin = profile.isAdmin || profile.id === adminUser.id;

  return (
    <div className="profile-page">
      <AppHeader />
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
        </div>

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

          <div className="detail-section">
            <h2 className="section-title">Friends</h2>
            <p className="friends-count">
              {profile.friends.length} {profile.friends.length === 1 ? 'Friend' : 'Friends'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

