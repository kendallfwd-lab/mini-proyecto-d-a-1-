import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import ErrorMessage from '../components/ui/ErrorMessage';
import AuthShell from '../components/auth/AuthShell';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ correo: '', password: '', mfa_code: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [notice, setNotice] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendEmailCode() {
    setError(''); setNotice(''); setSendingCode(true);
    try { await authService.requestEmailCode({ correo: form.correo, password: form.password }); setNotice('Código enviado a tu correo. Revisa también Spam.'); }
    catch (requestError) { setError(requestError.message); }
    finally { setSendingCode(false); }
  }

  function updateMfa(event) {
    setForm({ ...form, mfa_code: event.target.value.replace(/\D/g, '').slice(0, 6) });
  }

  return <AuthShell title="Iniciar sesión" subtitle="Accede a tu panel de inventario." footer={<>Acceso privado para administradores autorizados.</>}>
    <ErrorMessage error={error} />
    <form className="auth-form" onSubmit={submit}>
      <label>Correo
        <input type="email" autoComplete="email" placeholder="tu@correo.com" required value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} />
      </label>
      <label>Contraseña
        <input type="password" autoComplete="current-password" placeholder="••••••••" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
      </label>
      {notice && <div className="feedback success">{notice}</div>}
      <label>Código MFA <small>(administrador principal)</small>
        <input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength="6" placeholder="Ej. 482901" aria-describedby="mfa-help" required value={form.mfa_code} onChange={updateMfa} />
        <small id="mfa-help" className="auth-help">Abre tu app Authenticator y escribe el número de 6 dígitos que cambia cada 30 segundos. No pegues aquí el secreto largo ni la URI otpauth.</small>
      </label>
      <button type="button" className="link-button" disabled={sendingCode || !form.correo || !form.password} onClick={sendEmailCode}>{sendingCode ? 'Enviando código...' : 'Enviar código por correo'}</button>
      <div className="auth-options"><span>Sesión segura</span></div>
      <button className="button primary auth-submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar al panel'}<span>→</span></button>
    </form>
  </AuthShell>;
}
