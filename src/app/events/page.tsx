import ProtectedRoute from '../../components/ProtectedRoute';
import EventsPage from '../../pages/EventsPage';

export default function EventsRoute() {
  return (
    <ProtectedRoute>
      <EventsPage />
    </ProtectedRoute>
  );
}
