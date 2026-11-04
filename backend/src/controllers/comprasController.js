const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const service = require('../services/comprasService');

exports.list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.list() });
});

exports.get = asyncHandler(async (req, res) => {
  const data = await service.get(req.params.id);
  if (!data) throw httpError(404, 'Compra no encontrada');
  res.json({ success: true, data });
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body) });
});

exports.receive = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.receive(req.params.id, req.body) });
});
