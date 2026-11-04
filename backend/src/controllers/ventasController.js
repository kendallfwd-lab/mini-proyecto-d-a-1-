const asyncHandler = require('../utils/asyncHandler');
const service = require('../services/ventasService');

exports.list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.list() });
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body) });
});
