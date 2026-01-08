import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userService } from '../services/localDataService';
import { useState, useEffect } from 'react';
import { User } from '../types';
import './Stories.css';

const Stories = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await userService.getAllUsers();
        // Limit to first 8 users for stories
        setUsers(allUsers.slice(0, 8));
      } catch (error) {
        console.error('Error loading users for stories:', error);
      }
    };
    loadUsers();
  }, []);

  const handleStoryClick = async (userId: string) => {
    try {
      // Check if user is admin
      const user = await userService.getUser(userId);
      if (user?.isAdmin) {
        navigate('/admin-profile');
      } else {
        navigate(`/profile/${userId}`);
      }
    } catch (error) {
      // Fallback to regular profile route
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="stories-container">
      <div className="stories-scroll">
        {/* Your Story */}
        {currentUser && (
          <div className="story-item your-story">
            <div className="story-avatar-wrapper">
              <div className="story-avatar your-story-avatar">
                {currentUser.profileImage ? (
                  <img src={currentUser.profileImage} alt={currentUser.fullName} />
                ) : (
                  <div className="story-avatar-placeholder">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="add-story-icon">+</div>
            </div>
            <span className="story-name">Your Story</span>
          </div>
        )}

        {/* Other Users' Stories */}
        {users.map((user) => (
          <div
            key={user.id}
            className="story-item"
            onClick={() => handleStoryClick(user.id)}
          >
            <div className="story-avatar-wrapper">
              <div className="story-avatar">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} />
                ) : (
                  <div className="story-avatar-placeholder">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <span className="story-name">{user.fullName.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;

