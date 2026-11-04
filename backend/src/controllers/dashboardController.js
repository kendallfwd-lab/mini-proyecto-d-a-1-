const asyncHandler = require('../utils/asyncHandler');
const service = require('../services/dashboardService');

exports.summary = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.summary() });
});

exports.analytics = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.analytics() });
});
