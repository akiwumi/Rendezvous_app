import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css'

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'announcements', path: '/announcements', icon: '🏠', label: 'Home' },
    { id: 'events', path: '/events', icon: '📅', label: 'Events' },
    { id: 'search', path: '/search', icon: '👥', label: 'Search' },
    { id: 'chat', path: '/chat', icon: '💬', label: 'Chat' },
    { id: 'profile', path: '/profile', icon: '👤', label: 'Profile' },
  ]

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
          aria-label={item.label}
        >
          <div className="nav-icon">{item.icon}</div>
          {isActive(item.path) && <div className="nav-indicator"></div>}
        </button>
      ))}
    </div>
  )
}

export default BottomNav

