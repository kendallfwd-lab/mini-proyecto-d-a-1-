const express = require('express'); const cors = require('cors'); const { notFound, errorHandler } = require('./middlewares/errorHandler');
const app = express(); app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' })); app.use(express.json());
app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok', service: 'business-inventory-api' } }));
app.use('/api/productos', require('./routes/productoRoutes')); app.use('/api/categorias', require('./routes/categoriaRoutes')); app.use('/api/proveedores', require('./routes/proveedorRoutes')); app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use(notFound); app.use(errorHandler); module.exports = app;
