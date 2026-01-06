import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { adminUser } from '../data/dummyData';
import AppHeader from '../components/AppHeader';
import './SearchPage.css';

const SearchPage = () => {
  const { currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [members] = useState([
    adminUser,
    // In a real app, this would come from a database
  ]);

  const filteredMembers = members.filter(member =>
    member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = (_userId: string) => {
    if (!currentUser) {
      alert('Please register to add friends');
      return;
    }
    // In a real app, this would update the database
    alert('Friend request sent!');
  };

  const isFriend = (userId: string) => {
    return currentUser?.friends.includes(userId) || false;
  };

  return (
    <div className="search-page">
      <AppHeader />
      <div className="search-content">
        <h1 className="page-title">Find Members</h1>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="members-list">
          {filteredMembers.map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-info">
                {member.profileImage ? (
                  <img
                    src={member.profileImage}
                    alt={member.fullName}
                    className="member-avatar"
                  />
                ) : (
                  <div className="member-avatar-placeholder">
                    {member.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="member-details">
                  <div className="member-name">
                    {member.fullName}
                    {member.isAdmin && <span className="admin-badge">Admin</span>}
                  </div>
                  <div className="member-email">{member.email}</div>
                  {member.address && (
                    <div className="member-address">📍 {member.address}</div>
                  )}
                </div>
              </div>
              {currentUser && currentUser.id !== member.id && (
                <button
                  className={`friend-button ${isFriend(member.id) ? 'friends' : ''}`}
                  onClick={() => handleAddFriend(member.id)}
                  disabled={isFriend(member.id)}
                >
                  {isFriend(member.id) ? '✓ Friends' : '+ Add Friend'}
                </button>
              )}
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="no-results">
            <p>No members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

