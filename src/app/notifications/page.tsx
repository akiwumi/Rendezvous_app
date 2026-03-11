import ProtectedRoute from '../../components/ProtectedRoute';
import NotificationsPage from '../../pages/NotificationsPage';

export default function NotificationsRoute() {
  return (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  );
}
