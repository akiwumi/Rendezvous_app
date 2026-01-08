import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AppHeader from '../components/AppHeader';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Show loading state
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton?.textContent || 'Login';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Logging in...';
    }
    
    try {
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;
      
      console.log('Login attempt:', { email, passwordLength: password.length });
      
      const success = await loginUser(email, password);
      
      if (success) {
        console.log('Login successful, navigating to feed...');
        // Navigate to feed for Eugene (admin), announcements for others
        const userEmail = email;
        if (userEmail === 'akiwumi@gmail.com') {
          navigate('/feed');
        } else {
          navigate('/announcements');
        }
      } else {
        console.error('Login returned false');
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (error: any) {
      console.error('Login error caught:', error);
      // Show more detailed error messages
      let errorMessage = error.message || 'Login failed. Please try again.';
      
      // Preserve newlines in error messages
      if (errorMessage.includes('\n')) {
        errorMessage = errorMessage.split('\n').map((line: string, idx: number) => (
          <span key={idx}>{line}<br /></span>
        ));
      }
      
      setError(errorMessage);
    } finally {
      // Restore button state
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  };

  return (
    <div className="login-page">
      <AppHeader />
      <div className="login-content">
        <h1 className="page-title">Welcome Back</h1>
        <p className="page-subtitle">Login to access Rendezvous Social Club</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message" style={{ whiteSpace: 'pre-line' }}>
              {typeof error === 'string' ? error : error}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
          >
            Login
          </button>

          <div className="register-link">
            <p>Don't have an account?</p>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/register')}
            >
              Register Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

