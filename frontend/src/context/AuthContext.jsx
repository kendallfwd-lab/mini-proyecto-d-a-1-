import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { AUTH_MODE, setAuthToken, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null); const [user, setUser] = useState(null); const [isLoading, setLoading] = useState(true);
  const clearAuth = () => { setToken(null); setUser(null); setAuthToken(null); };
  const logout = async () => { try { if (token || AUTH_MODE === 'cookie') await authService.logout(); } finally { clearAuth(); } };
  useEffect(() => { setUnauthorizedHandler(clearAuth); if (AUTH_MODE === 'cookie') authService.me().then(setUser).catch(() => {}).finally(() => setLoading(false)); else setLoading(false); return () => setUnauthorizedHandler(null); }, []);
  const login = async (credentials) => { const data = await authService.login(credentials); setToken(data.token); setUser(data.user); setAuthToken(data.token); return data.user; };
  const value = useMemo(() => ({ token, user, isAuthenticated: Boolean(user && (AUTH_MODE === 'cookie' || token)), isLoading, login, logout }), [token, user, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
