const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const service = require('../services/proveedoresService');

exports.list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.list(req.query.search || '') });
});

exports.get = asyncHandler(async (req, res) => {
  const data = await service.get(req.params.id);
  if (!data) throw httpError(404, 'Proveedor no encontrado');
  res.json({ success: true, data });
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body) });
});

exports.update = asyncHandler(async (req, res) => {
  const data = await service.update(req.params.id, req.body);
  if (!data) throw httpError(404, 'Proveedor no encontrado');
  res.json({ success: true, data });
});

exports.remove = asyncHandler(async (req, res) => {
  const count = await service.remove(req.params.id);
  if (!count) throw httpError(404, 'Proveedor no encontrado');
  res.status(204).send();
});
