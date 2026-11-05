import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function RutaProtegida() { const { isAuthenticated, isLoading } = useAuth(); const location = useLocation(); if (isLoading) return <div className="loading">Cargando sesión...</div>; return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />; }
