function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = error.status || (
    ['ER_DUP_ENTRY', 'ER_ROW_IS_REFERENCED_2'].includes(error.code) ? 409 : 500
  );
  if (status >= 500) console.error(error);
  const message = error.code === 'ER_DUP_ENTRY'
    ? 'El registro ya existe'
    : error.code === 'ER_ROW_IS_REFERENCED_2'
      ? 'No se puede eliminar porque existen registros asociados'
    : status >= 500
      ? 'Error interno del servidor'
      : error.message;

  res.status(status).json({ success: false, error: message });
}

module.exports = errorHandler;
