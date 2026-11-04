function notFound(req, res) { res.status(404).json({ success: false, error: 'Ruta no encontrada' }); }
function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  console.error(error.message);
  const status = error.status || (error.code === 'ER_DUP_ENTRY' ? 409 : 500);
  const message = error.code === 'ER_DUP_ENTRY' ? 'El registro ya existe' : error.message || 'Error interno del servidor';
  res.status(status).json({ success: false, error: message });
}
module.exports = { notFound, errorHandler };
