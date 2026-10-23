import { Navigate, useLocation } from 'react-router-dom';
export default function NetworkLab() {
  const { search } = useLocation();
  return <Navigate to={`/network${search}`} replace/>;
}