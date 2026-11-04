const httpError = require('../utils/httpError');

function validateRequest(validator, source = 'body') {
  return function validate(req, res, next) {
    const value = req[source];
    if (source === 'body' && (!value || typeof value !== 'object' || Array.isArray(value))) {
      return next(httpError(400, 'El cuerpo de la solicitud debe ser un objeto JSON'));
    }
    const errors = validator(value);
    if (errors.length) return next(httpError(400, errors.join(', ')));
    next();
  };
}

function validateIdParam(req, res, next) {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return next(httpError(400, 'id debe ser un entero positivo'));
  }
  next();
}

module.exports = { validateRequest, validateIdParam };
