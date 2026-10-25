import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function AdminRoute() {
  const { user, isLoadingAuth, authChecked } = useAuth();
  if (isLoadingAuth || !authChecked) return <p role="status">Checking administrator access…</p>;
  if (user?.role !== 'admin') return <Navigate to="/" replace/>;
  return <Outlet/>;
}