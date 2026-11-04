const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const service = require('../services/gastosService');

exports.list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.list(req.query) });
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body) });
});

exports.update = asyncHandler(async (req, res) => {
  const data = await service.update(req.params.id, req.body);
  if (!data) throw httpError(404, 'Gasto no encontrado o de demostración');
  res.json({ success: true, data });
});

exports.remove = asyncHandler(async (req, res) => {
  const count = await service.remove(req.params.id);
  if (!count) throw httpError(404, 'Gasto no encontrado o de demostración');
  res.status(204).send();
});
