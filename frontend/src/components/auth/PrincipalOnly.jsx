import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrincipalOnly() {
  const { user } = useAuth();
  return user?.es_principal ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
