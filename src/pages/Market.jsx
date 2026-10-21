import { Navigate, useLocation } from 'react-router-dom';
export default function Market() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  params.set('tab', 'for-sale');
  return <Navigate to={`/names?${params}`} replace />;
}