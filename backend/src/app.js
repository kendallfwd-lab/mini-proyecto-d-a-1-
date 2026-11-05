const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('./config/cors');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/authMiddleware');
const csrf = require('./middleware/csrfMiddleware');

const app = express();

app.use(cors);
app.use(helmet());
app.use(express.json({ limit: '100kb' }));

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
