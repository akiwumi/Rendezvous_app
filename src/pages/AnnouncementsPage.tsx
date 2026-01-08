import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Announcement } from '../types';
import { announcementService } from '../services/localDataService';
import AppHeader from '../components/AppHeader';
import PullToRefresh from '../components/PullToRefresh';
import './AnnouncementsPage.css';

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const { currentUser, announcements, setAnnouncements } = useApp();

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await announcementService.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    };
    if (announcements.length === 0) {
      loadAnnouncements();
    }
  }, [announcements.length, setAnnouncements]);

  const handleRefresh = async () => {
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error refreshing announcements:', error);
    }
  };

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
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Hero Section */}
        <div className="hero-section">
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
          alt="Rendezvous Social Club"
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">Rendezvous</h1>
          <p className="hero-subtitle">Social Club Mallorca</p>
          <p className="hero-tagline">Where Exclusive Moments Come Together</p>
        </div>
      </div>

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
                <div className="announcement-image-container has-admin-watermark">
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
      </PullToRefresh>
    </div>
  );
};

export default AnnouncementsPage;

