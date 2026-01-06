import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/announcements');
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <img 
          src="/splash-screen.png" 
          alt="Rendezvous Social Club" 
          className="splash-image"
          onError={(e) => {
            // Fallback if image doesn't exist
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="splash-overlay">
          <h1 className="splash-title">Rendezvous</h1>
          <p className="splash-subtitle">Social Club</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

