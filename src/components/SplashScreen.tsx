'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import './SplashScreen.css';

const SplashScreen = () => {
  const router = useRouter();
  const { currentUser, loading } = useApp();
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // If already logged in, skip straight to feed
    if (!loading && currentUser) {
      router.replace('/announcements');
      return;
    }

    if (!loading) {
      // Show splash for 4 seconds, then fade out and navigate to login
      const fadeTimer = setTimeout(() => {
        setAnimateOut(true);
      }, 3500);

      const navTimer = setTimeout(() => {
        router.replace('/login');
      }, 4000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(navTimer);
      };
    }
  }, [loading, currentUser, router]);

  return (
    <div className={`splash-screen${animateOut ? ' fade-out' : ''}`}>
      <div className="splash-content">
        <img
          src="/splash-screen.jpg"
          alt="Rendezvous Social Club"
          className="splash-image"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="splash-overlay">
          <div className="splash-logo-area">
            <h1 className="splash-title">Rendezvous</h1>
            <p className="splash-subtitle">Social Club</p>
          </div>
          <div className="splash-loading">
            <div className="splash-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
