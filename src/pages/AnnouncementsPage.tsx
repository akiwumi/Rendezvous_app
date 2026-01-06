import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { dummyAnnouncements } from '../data/dummyData';
import { Announcement } from '../types';
import AppHeader from '../components/AppHeader';
import './AnnouncementsPage.css';

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [announcements] = useState<Announcement[]>(dummyAnnouncements);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const getTypeIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'party': return '🎉';
      case 'event': return '🍕';
      case 'exhibition': return '🎨';
      case 'tournament': return '🏆';
      case 'trip': return '✈️';
      default: return '📅';
    }
  };

  return (
    <div className="announcements-page">
      <AppHeader />
      <div className="announcements-content">
        <div className="announcements-header">
          <h1 className="page-title">Announcements</h1>
          {!currentUser && (
            <button
              className="register-button-top"
              onClick={() => navigate('/register')}
            >
              Join Now
            </button>
          )}
        </div>
        <div className="announcements-list">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              {announcement.image && (
                <div className="announcement-image-container">
                  <img 
                    src={announcement.image} 
                    alt={announcement.title}
                    className="announcement-image"
                  />
                </div>
              )}
              <div className="announcement-content">
                <div className="announcement-header">
                  <span className="announcement-type-icon">
                    {getTypeIcon(announcement.type)}
                  </span>
                  <h2 className="announcement-title">{announcement.title}</h2>
                </div>
                <p className="announcement-date">{formatDate(announcement.date)}</p>
                <p className="announcement-text">{announcement.content}</p>
                {announcement.link && (
                  <a 
                    href={announcement.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="announcement-link"
                  >
                    Learn More →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;

