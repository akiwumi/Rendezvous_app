import ProtectedRoute from '../../components/ProtectedRoute';
import ChatPage from '../../pages/ChatPage';

export default function ChatRoute() {
  return (
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  );
}
