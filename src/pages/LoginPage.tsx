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
    
    try {
      const success = await loginUser(formData.email, formData.password);
      if (success) {
        navigate('/announcements');
      } else {
        setError('Invalid email or password. Use: demo@rendezvous.club / demo123');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <AppHeader />
      <div className="login-content">
        <h1 className="page-title">Welcome Back</h1>
        <p className="page-subtitle">Login to access Rendezvous Social Club</p>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <p className="demo-info">Email: <strong>demo@rendezvous.club</strong></p>
          <p className="demo-info">Password: <strong>demo123</strong></p>
        </div>

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
            <div className="error-message">{error}</div>
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

