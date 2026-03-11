import ProtectedRoute from '../../components/ProtectedRoute';
import SearchPage from '../../pages/SearchPage';

export default function SearchRoute() {
  return (
    <ProtectedRoute>
      <SearchPage />
    </ProtectedRoute>
  );
}
