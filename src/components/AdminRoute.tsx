'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    if (!currentUser.isAdmin) {
      router.replace('/announcements');
    }
  }, [currentUser, loading, router]);

  if (loading) return null;
  if (!currentUser) return null;
  if (!currentUser.isAdmin) return null;
  return <>{children}</>;
}
