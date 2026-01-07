import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './BottomNav.css'

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadNotificationsCount, openSearch } = useApp();

  const navItems = [
    { id: 'announcements', path: '/announcements', icon: '🏠', label: 'Home' },
    { id: 'events', path: '/events', icon: '📅', label: 'Events' },
    { id: 'search', action: openSearch, icon: '🔍', label: 'Search' },
    { id: 'notifications', path: '/notifications', icon: '🔔', label: 'Notifications', badge: unreadNotificationsCount },
    { id: 'chat', path: '/chat', icon: '💬', label: 'Chat' },
    { id: 'profile', path: '/profile', icon: '👤', label: 'Profile' },
  ]

  const isActive = (path: string) => location.pathname === path;

  const handleClick = (item: typeof navItems[0]) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${item.path && isActive(item.path) ? 'active' : ''}`}
          onClick={() => handleClick(item)}
          aria-label={item.label}
        >
          <div className="nav-icon-wrapper">
            <div className="nav-icon">{item.icon}</div>
            {item.badge && item.badge > 0 && (
              <span className="nav-badge">{item.badge > 9 ? '9+' : item.badge}</span>
            )}
          </div>
          {item.path && isActive(item.path) && <div className="nav-indicator"></div>}
        </button>
      ))}
    </div>
  )
}

export default BottomNav

