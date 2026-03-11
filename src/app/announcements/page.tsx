import ProtectedRoute from '../../components/ProtectedRoute';
import AnnouncementsPage from '../../pages/AnnouncementsPage';

export default function AnnouncementsRoute() {
  return (
    <ProtectedRoute>
      <AnnouncementsPage />
    </ProtectedRoute>
  );
}
