const jwt = require('jsonwebtoken');

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado');
  }
  return process.env.JWT_SECRET;
}

function requerirAutenticacion(req, res, next) {
  const encabezado = req.get('Authorization');
  const [tipo, token] = encabezado ? encabezado.split(' ') : [];

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token Bearer requerido' });
  }

  try {
    req.usuario = jwt.verify(token, getJwtSecret());
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para esta operación' });
    }
    next();
  };
}

module.exports = { getJwtSecret, requerirAutenticacion, permitirRoles };
