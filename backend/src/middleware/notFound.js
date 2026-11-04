module.exports = function notFound(req, res) {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' });
};
