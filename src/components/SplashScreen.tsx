import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="splash-screen">
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
