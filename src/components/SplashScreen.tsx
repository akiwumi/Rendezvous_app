import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useApp();

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/feed', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <div className="splash-overlay">
            <h1 className="splash-title">Rendezvous</h1>
            <p className="splash-subtitle">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img 
          src="/splash-screen.jpg" 
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
          
          <div className="splash-actions">
            <button 
              className="splash-button login-button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="splash-button register-button"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
