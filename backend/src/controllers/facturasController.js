const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const service = require('../services/facturasService');

exports.list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.list() });
});

exports.get = asyncHandler(async (req, res) => {
  const data = await service.get(req.params.id);
  if (!data) throw httpError(404, 'Factura no encontrada');
  res.json({ success: true, data });
});
