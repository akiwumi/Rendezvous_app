'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import './AppHeader.css';

const PAGE_TITLES: Record<string, string> = {
  '/feed': 'Feed',
  '/announcements': 'Announcements',
  '/events': 'Events',
  '/search': 'Search',
  '/chat': 'Chat',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/admin-profile': 'Admin Profile',
  '/admin-console': 'Console',
  '/admin': 'Dashboard',
  '/register': 'Register',
};

const AppHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutUser, currentUser } = useApp();

  const title = PAGE_TITLES[pathname ?? ''] ??
    (pathname?.startsWith('/profile/') ? 'Profile' : 'Rendezvous');

  const handleLogout = async () => {
    await logoutUser();
    router.replace('/login');
  };

  return (
    <header className="app-header">
      <div className="app-header-spacer" />
      <h1 className="app-header-title">{title}</h1>
      {currentUser ? (
        <button
          className="app-header-logout"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      ) : (
        <div className="app-header-spacer" />
      )}
    </header>
  );
};

export default AppHeader;
