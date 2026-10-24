import { Navigate, useLocation } from 'react-router-dom';
export default function NetworkSearch() {
  const { search } = useLocation();
  return <Navigate to={`/network/discover${search}`} replace/>;
}