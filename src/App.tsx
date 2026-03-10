import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import SplashScreen from './components/SplashScreen';
import BottomNav from './components/BottomNav';
import SearchBar from './components/SearchBar';
import LoginPage from './pages/LoginPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import RegistrationPage from './pages/RegistrationPage';
import EventsPage from './pages/EventsPage';
import SearchPage from './pages/SearchPage';
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminConsolePage from './pages/AdminConsolePage';
import AdminPage from './pages/AdminPage';
import AdminAdsPage from './pages/AdminAdsPage';
import AdminMessagesPage from './pages/AdminMessagesPage';
import CreatePostPage from './pages/CreatePostPage';
import './App.css';

// Redirects unauthenticated users to /login
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useApp();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

// Redirects non-admins to /announcements
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useApp();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!currentUser.isAdmin) return <Navigate to="/announcements" replace />;
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const hideNav = ['/', '/login', '/register', '/admin-console', '/admin', '/admin/ads', '/admin/messages', '/admin/create-post'].includes(location.pathname);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/feed" element={<Navigate to="/announcements" replace />} />

        {/* Protected — any logged-in user */}
        <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin-profile" element={<AdminRoute><AdminProfilePage /></AdminRoute>} />
        <Route path="/admin-console" element={<AdminRoute><AdminConsolePage /></AdminRoute>} />
        <Route path="/admin/ads" element={<AdminRoute><AdminAdsPage /></AdminRoute>} />
        <Route path="/admin/messages" element={<AdminRoute><AdminMessagesPage /></AdminRoute>} />
        <Route path="/admin/create-post" element={<AdminRoute><CreatePostPage /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideNav && <SearchBar />}
      {!hideNav && <BottomNav />}
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
