import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { setAuthToken, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null); const [user, setUser] = useState(null); const [isLoading, setLoading] = useState(true);
  const logout = () => { setToken(null); setUser(null); setAuthToken(null); };
  useEffect(() => { setUnauthorizedHandler(logout); setLoading(false); return () => setUnauthorizedHandler(null); }, []);
  const login = async (credentials) => { const data = await authService.login(credentials); setToken(data.token); setUser(data.user); setAuthToken(data.token); return data.user; };
  const register = (data) => authService.register(data);
  const value = useMemo(() => ({ token, user, isAuthenticated: Boolean(token && user), isLoading, login, register, logout }), [token, user, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
