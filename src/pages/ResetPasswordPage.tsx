import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './LoginPage.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [done, setDone] = useState(false);

  // Supabase fires PASSWORD_RECOVERY once the recovery token in the URL is parsed.
  // This tells us the session is active and we can call updateUser.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src="/splash-screen.png" alt="" className="login-bg-image" />
      <div className="login-bg-overlay" />

      <div className="login-card">
        <h2 className="login-heading">New Password</h2>
        <p className="login-subheading">
          {done
            ? 'Password updated! You can now log in.'
            : 'Choose a new password for your account.'}
        </p>

        {done ? (
          <button
            type="button"
            className="login-submit-btn"
            style={{ marginTop: '12px' }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        ) : !sessionReady ? (
          <p className="login-subheading" style={{ marginTop: '16px' }}>
            Validating your reset link…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label className="login-label">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className={`login-input${error ? ' error' : ''}`}
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                className={`login-input${error ? ' error' : ''}`}
                placeholder="Repeat your new password"
                required
                autoComplete="new-password"
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? 'Updating…' : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
