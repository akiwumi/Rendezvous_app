'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!currentUser) router.replace('/login');
  }, [currentUser, loading, router]);

  if (loading) return null;
  if (!currentUser) return null;
  return <>{children}</>;
}
