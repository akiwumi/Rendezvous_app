import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userService } from '../services/supabaseService';
import { User } from '../types';
import AppHeader from '../components/AppHeader';
import './SearchPage.css';

const SearchPage = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const users = await userService.getAllUsers();
        // Admin should be included in the users list if loaded correctly
        setMembers(users);
      } catch (error) {
        console.error('Error loading members:', error);
        setMembers([]);
      }
    };
    loadMembers();
  }, []);

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

  const handleViewProfile = (member: User) => {
    if (member.isAdmin) {
      navigate('/admin-profile');
    } else {
      navigate(`/profile/${member.id}`);
    }
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
              <div 
                className="member-info clickable"
                onClick={() => handleViewProfile(member)}
              >
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
              <div className="member-actions">
                <button
                  className="view-profile-btn"
                  onClick={() => handleViewProfile(member)}
                >
                  View Profile
                </button>
                {currentUser && currentUser.id !== member.id && (
                  <button
                    className={`friend-button ${isFriend(member.id) ? 'friends' : ''}`}
                    onClick={() => handleAddFriend(member.id)}
                    disabled={isFriend(member.id)}
                  >
                    {isFriend(member.id) ? '✓ Friends' : '+ Add'}
                  </button>
                )}
              </div>
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

