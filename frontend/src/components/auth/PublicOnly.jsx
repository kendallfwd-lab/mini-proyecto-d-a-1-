import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicOnly() { const { isAuthenticated, isLoading } = useAuth(); if (isLoading) return <div className="loading">Cargando sesión...</div>; return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />; }
