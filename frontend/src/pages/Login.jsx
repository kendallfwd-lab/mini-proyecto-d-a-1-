import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ui/ErrorMessage';
import AuthShell from '../components/auth/AuthShell';

export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation(); const [form, setForm] = useState({ correo: '', password: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(event) { event.preventDefault(); setError(''); setLoading(true); try { await login(form); navigate(location.state?.from?.pathname || '/dashboard', { replace: true }); } catch (e) { setError(e.message); } finally { setLoading(false); } }
  return <AuthShell title="Iniciar sesión" subtitle="Accede a tu panel de inventario." footer={<>¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></>}><ErrorMessage error={error}/><form className="auth-form" onSubmit={submit}><label>Correo<input type="email" autoComplete="email" placeholder="tu@correo.com" required value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })}/></label><label>Contraseña<input type="password" autoComplete="current-password" placeholder="••••••••" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/></label><div className="auth-options"><label className="remember"><input type="checkbox"/> Recordarme</label><span>Sesión segura</span></div><button className="button primary auth-submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar al panel'}<span>→</span></button></form></AuthShell>;
}
