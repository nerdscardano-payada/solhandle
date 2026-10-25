import { useAuth } from '@/lib/AuthContext';

export default function AdminOnly({ children }) {
  const { user, isLoadingAuth } = useAuth();
  return !isLoadingAuth && user?.role === 'admin' ? children : null;
}