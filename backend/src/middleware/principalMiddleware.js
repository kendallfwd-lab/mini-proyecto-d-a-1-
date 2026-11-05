const httpError = require('../utils/httpError');
module.exports = function principalMiddleware(req, res, next) { if (!req.user?.activo || !req.user?.es_principal) return next(httpError(403, 'Acceso prohibido')); next(); };
