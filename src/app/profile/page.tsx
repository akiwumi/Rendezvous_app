import ProtectedRoute from '../../components/ProtectedRoute';
import ProfilePage from '../../pages/ProfilePage';

export default function ProfileRoute() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
