'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import './WelcomePage.css';

const WelcomePage = () => {
  const router = useRouter();
  const { currentUser, loading } = useApp();

  useEffect(() => {
    // Clear the hash from URL after Supabase has processed the auth tokens
    if (window.location.hash && currentUser) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [currentUser]);

  const handleContinue = () => {
    router.replace('/profile');
  };

  // Show loading while auth state is being established (e.g. from email link hash)
  if (loading) {
    return (
      <div className="welcome-page">
        <img src="/splash-screen.jpg" alt="" className="welcome-bg-image" />
        <div className="welcome-bg-overlay" />
        <div className="welcome-card">
          <p className="welcome-loading">Confirming your email…</p>
        </div>
      </div>
    );
  }

  // Not authenticated – redirect to login (e.g. user navigated to /welcome directly)
  if (!currentUser) {
    router.replace('/login');
    return null;
  }

  const displayName = currentUser.fullName || currentUser.email?.split('@')[0] || 'there';

  return (
    <div className="welcome-page">
      <img src="/splash-screen.jpg" alt="" className="welcome-bg-image" />
      <div className="welcome-bg-overlay" />

      <div className="welcome-card">
        <h1 className="welcome-heading">Welcome to Rendezvous</h1>
        <p className="welcome-subheading">
          Hi {displayName}! Your email has been verified. You're all set to explore the club.
        </p>
        <button
          type="button"
          className="welcome-continue-btn"
          onClick={handleContinue}
        >
          Continue to Profile
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
