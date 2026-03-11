'use client';

import { usePathname } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import BottomNav from '../components/BottomNav';

const HIDE_NAV_PATHS = [
  '/',
  '/login',
  '/register',
  '/welcome',
  '/forgot-password',
  '/reset-password',
  '/admin-console',
  '/admin',
  '/admin/ads',
  '/admin/messages',
  '/admin/create-post',
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname ? HIDE_NAV_PATHS.includes(pathname) : false;

  return (
    <>
      {children}
      {!hideNav && <SearchBar />}
      {!hideNav && <BottomNav />}
    </>
  );
}
