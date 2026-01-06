import { useApp } from '../context/AppContext';
import AppHeader from '../components/AppHeader';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, currentUser } = useApp();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝';
      case 'event': return '📅';
      case 'announcement': return '📢';
      case 'friend': return '👥';
      case 'comment': return '💬';
      case 'like': return '👍';
      case 'message': return '✉️';
      default: return '🔔';
    }
  };

  if (!currentUser) {
    return (
      <div className="notifications-page">
        <AppHeader />
        <div className="notifications-content">
          <div className="login-prompt">
            <p>Please login to view notifications</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <AppHeader />
      <div className="notifications-content">
        <div className="notifications-header">
          <h1 className="page-title">Notifications</h1>
          {notifications.some(n => !n.read) && (
            <button
              className="mark-all-read-btn"
              onClick={markAllNotificationsAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="no-notifications">
            <span className="no-notifications-icon">🔔</span>
            <p>No notifications yet</p>
            <p className="no-notifications-subtitle">
              You'll see updates about posts, events, and announcements here
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && markNotificationAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    {!notification.read && <span className="unread-indicator"></span>}
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  {notification.relatedUserName && (
                    <div className="notification-user">
                      {notification.relatedUserImage ? (
                        <img
                          src={notification.relatedUserImage}
                          alt={notification.relatedUserName}
                          className="notification-user-avatar"
                        />
                      ) : (
                        <div className="notification-user-avatar-placeholder">
                          {notification.relatedUserName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="notification-user-name">
                        {notification.relatedUserName}
                      </span>
                    </div>
                  )}
                  <span className="notification-time">{formatTime(notification.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

