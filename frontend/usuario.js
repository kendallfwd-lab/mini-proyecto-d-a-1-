const API_URL = 'http://localhost:3010';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('usuario') || 'null');
const $ = (selector) => document.querySelector(selector);

if (!token || !user) window.location.replace('./');
if (user?.rol === 'admin') window.location.replace('./');

async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || `Error ${response.status}`);
  return data;
}

function renderUser() {
  const fullName = [user.nombre, user.apellido1, user.apellido2].filter(Boolean).join(' ') || 'Usuario';
  const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
  $('#avatar').textContent = initials || 'U';
  $('#full-name').textContent = fullName;
  $('#email').textContent = user.correo || 'Sin correo';
  $('#role').textContent = `Rol: ${user.rol || 'usuario'}`;
  $('#user-id').textContent = `ID: ${user.id || '-'}`;
  $('#info-name').textContent = fullName;
  $('#info-email').textContent = user.correo || 'Sin correo';
  $('#info-height').textContent = user.altura ? `${user.altura} m` : 'No indicada';
  $('#info-ethnicity').textContent = user.etnia || 'No indicada';
}

async function loadProjects() {
  try {
    const projects = await api('/proyecto');
    const ownProjects = projects.filter((project) => Number(project.usuarioId) === Number(user.id));
    $('#projects-body').innerHTML = ownProjects.map((project) => `<tr><td>${project.id}</td><td>${project.nombre}</td><td>${project.descripcion || 'Sin descripción'}</td><td>${project.estado.replace('_', ' ')}</td></tr>`).join('') || '<tr><td colspan="4">Todavía no tienes proyectos.</td></tr>';
  } catch (error) { $('#message').textContent = error.message; }
}

$('#project-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.target.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const body = Object.fromEntries(new FormData(event.target).entries());
    await api('/proyecto', { method: 'POST', body: JSON.stringify(body) });
    event.target.reset();
    $('#message').textContent = 'Proyecto creado correctamente.';
    $('#message').classList.add('success');
    await loadProjects();
  } catch (error) { $('#message').textContent = error.message; } finally { button.disabled = false; }
});

$('#refresh-projects').addEventListener('click', loadProjects);
$('#logout-button').addEventListener('click', () => { localStorage.clear(); window.location.replace('./'); });
renderUser();
loadProjects();
