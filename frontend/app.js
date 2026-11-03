const API_URL = 'http://localhost:3010';
const state = { token: localStorage.getItem('token'), usuario: JSON.parse(localStorage.getItem('usuario') || 'null'), page: 1, filters: { limit: 10 } };
const $ = (selector) => document.querySelector(selector);
const formData = (form) => Object.fromEntries(new FormData(form).entries());
function showMessage(selector, message, success = false) { const el = $(selector); el.textContent = message || ''; el.classList.toggle('success', success); }
async function api(path, options = {}) { const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}), ...(options.headers || {}) }; const response = await fetch(`${API_URL}${path}`, { ...options, headers }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(Array.isArray(data.error) ? data.error.join(', ') : data.error || data.message || `Error ${response.status}`); return data; }
function setAuthenticated(authenticated) { $('#auth-view').classList.toggle('hidden', authenticated); $('#app-view').classList.toggle('hidden', !authenticated); if (authenticated) { $('#session-user').textContent = `${state.usuario?.nombre || ''} · ${state.usuario?.rol || 'usuario'}`; loadUsers(); loadProjects(); } }
async function login(event) { event.preventDefault(); try { const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(formData(event.target)) }); state.token = data.token; state.usuario = data.usuario; localStorage.setItem('token', state.token); localStorage.setItem('usuario', JSON.stringify(state.usuario)); showMessage('#login-message', 'Sesión iniciada', true); setAuthenticated(true); } catch (error) { showMessage('#login-message', error.message); } }
async function register(event) { event.preventDefault(); try { await api('/usuario', { method: 'POST', body: JSON.stringify(formData(event.target)) }); event.target.reset(); showMessage('#app-message', 'Usuario creado correctamente', true); loadUsers(); } catch (error) { showMessage('#app-message', error.message); } }
async function loadUsers() { try { const params = new URLSearchParams({ ...state.filters, page: state.page }); const data = await api(`/usuario?${params}`); $('#users-body').innerHTML = data.datos.map((user) => `<tr><td>${user.id}</td><td>${user.nombre} ${user.apellido1}</td><td>${user.correo}</td><td>${user.rol}</td><td><button class="small" data-edit="${user.id}">Editar</button> ${state.usuario?.rol === 'admin' ? `<button class="small danger" data-delete="${user.id}">Eliminar</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="5">No hay usuarios.</td></tr>'; $('#page-label').textContent = `Página ${data.paginacion.page} de ${data.paginacion.totalPaginas || 1}`; $('#previous-page').disabled = state.page <= 1; $('#next-page').disabled = state.page >= data.paginacion.totalPaginas; } catch (error) { showMessage('#app-message', error.message); } }
async function loadProjects() { try { const projects = await api('/proyecto'); $('#projects-body').innerHTML = projects.map((project) => `<tr><td>${project.id}</td><td>${project.nombre}</td><td>${project.descripcion || 'Sin descripción'}</td><td><span class="status status-${project.estado}">${project.estado.replace('_', ' ')}</span></td><td>${project.usuarioId}</td></tr>`).join('') || '<tr><td colspan="5">No hay proyectos todavía.</td></tr>'; } catch (error) { showMessage('#app-message', error.message); } }
async function createProject(event) { event.preventDefault(); const button = event.target.querySelector('button[type="submit"]'); button.disabled = true; try { await api('/proyecto', { method: 'POST', body: JSON.stringify(formData(event.target)) }); event.target.reset(); showMessage('#app-message', 'Proyecto creado correctamente', true); await loadProjects(); } catch (error) { showMessage('#app-message', error.message === 'Token Bearer requerido' ? 'Tu sesión expiró. Inicia sesión nuevamente.' : error.message); } finally { button.disabled = false; } }
async function editUser(id) { try { const user = await api(`/usuario/${id}`); const form = $('#edit-form'); Object.entries(user).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; }); $('#edit-dialog').showModal(); } catch (error) { showMessage('#app-message', error.message); } }
async function saveUser(event) { event.preventDefault(); try { const values = formData(event.target); const id = values.id; delete values.id; await api(`/usuario/${id}`, { method: 'PATCH', body: JSON.stringify(values) }); $('#edit-dialog').close(); showMessage('#app-message', 'Usuario actualizado', true); loadUsers(); } catch (error) { showMessage('#app-message', error.message); } }
async function deleteUser(id) { if (!confirm('¿Eliminar este usuario?')) return; try { await api(`/usuario/${id}`, { method: 'DELETE' }); showMessage('#app-message', 'Usuario eliminado', true); loadUsers(); } catch (error) { showMessage('#app-message', error.message); } }
$('#login-form').addEventListener('submit', login); $('#register-form').addEventListener('submit', register); $('#project-form').addEventListener('submit', createProject); $('#edit-form').addEventListener('submit', saveUser); $('#close-dialog').addEventListener('click', () => $('#edit-dialog').close()); $('#logout-button').addEventListener('click', () => { localStorage.clear(); state.token = null; state.usuario = null; setAuthenticated(false); }); $('#filter-form').addEventListener('submit', (event) => { event.preventDefault(); state.filters = { ...state.filters, ...formData(event.target) }; state.page = 1; loadUsers(); }); $('#previous-page').addEventListener('click', () => { state.page -= 1; loadUsers(); }); $('#next-page').addEventListener('click', () => { state.page += 1; loadUsers(); }); $('#refresh-projects').addEventListener('click', loadProjects); $('#users-body').addEventListener('click', (event) => { if (event.target.dataset.edit) editUser(event.target.dataset.edit); if (event.target.dataset.delete) deleteUser(event.target.dataset.delete); }); setAuthenticated(Boolean(state.token));
$('#clear-register').addEventListener('click', () => $('#register-form').reset());
$('#focus-register').addEventListener('click', () => { $('#register-user-card').scrollIntoView({ behavior: 'smooth', block: 'center' }); $('#register-form').elements.nombre.focus(); });

const updateUserStats = () => {
  const rows = $('#users-body').querySelectorAll('tr');
  $('#visible-users').textContent = rows.length && !rows[0].textContent.includes('No hay') ? rows.length : 0;
};
new MutationObserver(updateUserStats).observe($('#users-body'), { childList: true });

const loadUsersOriginal = loadUsers;
loadUsers = async () => {
  const result = await loadUsersOriginal();
  const summary = await api('/usuario?limit=1');
  $('#total-users').textContent = summary.paginacion.total;
  const rows = $('#users-body').querySelectorAll('tr');
  $('#visible-users').textContent = rows.length && !rows[0].textContent.includes('No hay') ? rows.length : 0;
  return result;
};
const loadProjectsOriginal = loadProjects;
loadProjects = async () => {
  const result = await loadProjectsOriginal();
  const rows = $('#projects-body').querySelectorAll('tr');
  $('#total-projects').textContent = rows.length && !rows[0].textContent.includes('No hay') ? rows.length : 0;
  return result;
};
if (state.token) { loadUsers(); loadProjects(); }

function renderProfile() {
  const user = state.usuario || {};
  const fullName = [user.nombre, user.apellido1, user.apellido2].filter(Boolean).join(' ') || 'Usuario';
  const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
  $('#profile-avatar').textContent = initials || 'U';
  $('#profile-name').textContent = fullName;
  $('#profile-email').textContent = user.correo || 'Sin correo';
  $('#profile-role').textContent = `Rol: ${user.rol || 'usuario'}`;
  $('#profile-id').textContent = `ID: ${user.id || '-'}`;
}

$('#profile-edit').addEventListener('click', () => editUser(state.usuario.id));
$('#profile-password').addEventListener('click', () => {
  $('#password-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('#password-form').elements.id.value = state.usuario.id;
  $('#password-form').elements.contrasenaActual.focus();
});
renderProfile();
const setAuthenticatedOriginal = setAuthenticated;
setAuthenticated = (authenticated) => { setAuthenticatedOriginal(authenticated); if (authenticated) renderProfile(); };

function renderUserView() {
  const user = state.usuario || {};
  const fullName = [user.nombre, user.apellido1, user.apellido2].filter(Boolean).join(' ') || 'Usuario';
  const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
  $('#user-avatar').textContent = initials || 'U';
  $('#user-name').textContent = fullName;
  $('#user-email').textContent = user.correo || 'Sin correo';
  $('#user-role').textContent = `Rol: ${user.rol || 'usuario'}`;
  $('#user-id').textContent = `ID: ${user.id || '-'}`;
  $('#user-full-name').textContent = fullName;
  $('#user-visible-email').textContent = user.correo || 'Sin correo';
  $('#user-height').textContent = user.altura ? `${user.altura} m` : 'No indicada';
  $('#user-ethnicity').textContent = user.etnia || 'No indicada';
}

async function loadUserProjects() {
  try {
    const projects = await api('/proyecto');
    $('#user-projects-body').innerHTML = projects.map((project) => `<tr><td>${project.id}</td><td>${project.nombre}</td><td>${project.descripcion || 'Sin descripción'}</td><td><span class="status status-${project.estado}">${project.estado.replace('_', ' ')}</span></td><td>${project.usuarioId}</td></tr>`).join('') || '<tr><td colspan="5">No hay proyectos todavía.</td></tr>';
  } catch (error) {
    $('#user-projects-body').innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
}

$('#user-logout').addEventListener('click', () => {
  localStorage.clear();
  state.token = null;
  state.usuario = null;
  setAuthenticated(false);
});
$('#user-refresh-projects').addEventListener('click', loadUserProjects);

const setAuthenticatedByRole = setAuthenticated;
setAuthenticated = (authenticated) => {
  if (!authenticated) {
    setAuthenticatedByRole(false);
    $('#user-view').classList.add('hidden');
    return;
  }
  if (state.usuario?.rol === 'admin') {
    setAuthenticatedByRole(true);
    $('#user-view').classList.add('hidden');
  } else {
    $('#auth-view').classList.add('hidden');
    $('#app-view').classList.add('hidden');
    $('#user-view').classList.remove('hidden');
    renderUserView();
    loadUserProjects();
  }
};
setAuthenticated(Boolean(state.token));

const setAuthenticatedPage = setAuthenticated;
setAuthenticated = (authenticated) => {
  if (authenticated && state.usuario?.rol !== 'admin') {
    window.location.replace('./usuario.html');
    return;
  }
  setAuthenticatedPage(authenticated);
};
if (state.token && state.usuario?.rol !== 'admin') window.location.replace('./usuario.html');
