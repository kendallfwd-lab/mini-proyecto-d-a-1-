const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('./config/cors');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/authMiddleware');
const csrf = require('./middleware/csrfMiddleware');

const app = express();
app.set('trust proxy', 1);

app.use(cors);
app.use(helmet({ hsts: { maxAge: 31536000, includeSubDomains: true, preload: true } }));
app.use((req, res, next) => { if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') return res.status(426).json({ success: false, error: 'HTTPS requerido' }); next(); });
app.use(express.json({ limit: '100kb' }));

app.get('/', (req, res) => {
  res.json({ success: true, data: { service: 'business-inventory-api', status: 'ok', health: '/api/health', frontend: 'http://localhost:5173' } });
});
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'business-inventory-api' } });
});
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false }), require('./routes/authRoutes'));
app.use('/api', auth, csrf);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/productos', require('./routes/productosRoutes'));
app.use('/api/categorias', require('./routes/categoriasRoutes'));
app.use('/api/proveedores', require('./routes/proveedoresRoutes'));
app.use('/api/clientes', require('./routes/clientesRoutes'));
app.use('/api/compras', require('./routes/comprasRoutes'));
app.use('/api/ventas', require('./routes/ventasRoutes'));
app.use('/api/facturas', require('./routes/facturasRoutes'));
app.use('/api/gastos', require('./routes/gastosRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
