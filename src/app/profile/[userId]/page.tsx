import ProtectedRoute from '../../../components/ProtectedRoute';
import ProfilePage from '../../../pages/ProfilePage';

export default function ProfileUserIdRoute() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
