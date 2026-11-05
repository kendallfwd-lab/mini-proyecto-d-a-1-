import { useEffect, useMemo, useState } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const emptyForm = { nombre: '', correo: '', password: '' };
const dateFormatter = new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' });

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

export default function Administradores() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [audit, setAudit] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const [rows, events] = await Promise.all([adminService.list(), adminService.audit()]); setAdmins(rows); setAudit(events); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user?.es_principal) load(); }, [user?.es_principal]);

  const filteredAdmins = useMemo(() => admins.filter((admin) => `${admin.nombre} ${admin.correo}`.toLowerCase().includes(query.toLowerCase())), [admins, query]);
  const principalCount = admins.filter((admin) => admin.es_principal).length;
  const activeCount = admins.filter((admin) => admin.activo).length;

  if (!user?.es_principal) return <section className="page admin-page"><div className="admin-empty"><span className="admin-empty-icon">!</span><h2>Acceso restringido</h2><p>Solo el administrador principal puede gestionar las cuentas administrativas.</p></div></section>;

  function updateField(event) { setForm({ ...form, [event.target.name]: event.target.value }); }

  async function submit(event) {
    event.preventDefault(); setError(''); setMessage(''); setSaving(true);
    try { await adminService.create(form); setForm(emptyForm); setMessage('Administrador creado correctamente.'); await load(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function deactivate(id) {
    if (!window.confirm('¿Desactivar este administrador? Ya no podrá iniciar sesión.')) return;
    setError('');
    try { await adminService.deactivate(id); setMessage('Administrador desactivado.'); await load(); }
    catch (e) { setError(e.message); }
  }

  async function revokeSessions(id) {
    if (!window.confirm('¿Revocar todas las sesiones de este administrador?')) return;
    try { await adminService.revokeSessions(id); setMessage('Sesiones revocadas correctamente.'); await load(); } catch (e) { setError(e.message); }
  }

  return <section className="page admin-page">
    <div className="admin-hero">
      <div><p className="eyebrow">CONTROL DE ACCESO</p><h2>Administradores</h2><p className="admin-subtitle">Gestiona quién puede entrar al panel empresarial y protege las operaciones de tu negocio.</p></div>
      <div className="admin-hero-badge"><span className="admin-pulse" /> Sistema privado</div>
    </div>

    <div className="admin-stats"><div className="admin-stat"><span className="admin-stat-icon purple">♙</span><div><strong>{admins.length}</strong><span>Cuentas registradas</span></div></div><div className="admin-stat"><span className="admin-stat-icon green">✓</span><div><strong>{activeCount}</strong><span>Accesos activos</span></div></div><div className="admin-stat"><span className="admin-stat-icon amber">★</span><div><strong>{principalCount}</strong><span>Administrador principal</span></div></div></div>

    {error && <div className="feedback error admin-feedback" role="alert">{error}</div>}{message && <div className="feedback success admin-feedback" role="status">{message}</div>}

    <div className="admin-create-card"><div className="admin-card-heading"><div><h3>Crear administrador</h3><p>La nueva cuenta tendrá permisos empresariales, pero no podrá crear otros administradores.</p></div><span className="admin-lock">⌘</span></div><form className="admin-form" onSubmit={submit}><label><span>Nombre completo</span><input name="nombre" required minLength="2" autoComplete="name" placeholder="Ej. Ana Rodríguez" value={form.nombre} onChange={updateField}/></label><label><span>Correo electrónico</span><input name="correo" required type="email" autoComplete="email" placeholder="ana@empresa.com" value={form.correo} onChange={updateField}/></label><label><span>Contraseña temporal</span><div className="admin-password"><input name="password" required minLength="8" maxLength="72" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={updateField}/><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? 'Ocultar' : 'Mostrar'}</button></div></label><button className="button primary admin-submit" disabled={saving}>{saving ? 'Creando…' : 'Crear administrador'}<span>→</span></button></form></div>

    <div className="admin-list-card"><div className="admin-list-heading"><div><h3>Cuentas administrativas</h3><p>{filteredAdmins.length} resultado{filteredAdmins.length === 1 ? '' : 's'} · Los cambios se guardan en MySQL</p></div><label className="admin-search"><span aria-hidden="true">⌕</span><input aria-label="Buscar administrador" placeholder="Buscar por nombre o correo" value={query} onChange={(event) => setQuery(event.target.value)}/></label></div>{loading ? <div className="admin-loading">Cargando administradores…</div> : filteredAdmins.length === 0 ? <div className="admin-loading">No encontramos administradores con esa búsqueda.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Administrador</th><th>Creación</th><th>Estado</th><th>Tipo</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{filteredAdmins.map((admin) => <tr key={admin.id}><td><div className="admin-person"><span className={`admin-avatar ${admin.es_principal ? 'principal' : ''}`}>{admin.nombre.slice(0, 2).toUpperCase()}</span><div><strong>{admin.nombre}</strong><small>{admin.correo}</small></div></div></td><td className="admin-date">{formatDate(admin.fecha_creacion)}</td><td><span className={`status-pill ${admin.activo ? 'active' : 'inactive'}`}><i />{admin.activo ? 'Activo' : 'Inactivo'}</span></td><td><span className={`role-pill ${admin.es_principal ? 'principal' : ''}`}>{admin.es_principal ? 'Principal' : 'Adicional'}</span></td><td className="admin-actions">{!admin.es_principal && admin.activo && <button className="link-button danger-text" onClick={() => deactivate(admin.id)}>Desactivar</button>}</td></tr>)}</tbody></table></div>}</div>
  </section>;
}
