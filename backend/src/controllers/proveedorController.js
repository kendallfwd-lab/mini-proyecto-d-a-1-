const model = require('../models/proveedorModel');
const { validateSupplier } = require('../validators/inventoryValidators');
function bad(errors) { const e = new Error(errors.join(', ')); e.status = 400; return e; }
exports.list = async (req, res, next) => { try { res.json({ success: true, data: await model.findAll(req.query.search || '') }); } catch (e) { next(e); } };
exports.get = async (req, res, next) => { try { const data = await model.findById(req.params.id); if (!data) return res.status(404).json({ success: false, error: 'Proveedor no encontrado' }); res.json({ success: true, data }); } catch (e) { next(e); } };
exports.create = async (req, res, next) => { try { const errors = validateSupplier(req.body); if (errors.length) throw bad(errors); res.status(201).json({ success: true, data: await model.create(req.body) }); } catch (e) { next(e); } };
exports.update = async (req, res, next) => { try { const errors = validateSupplier(req.body); if (errors.length) throw bad(errors); const data = await model.update(req.params.id, req.body); if (!data) return res.status(404).json({ success: false, error: 'Proveedor no encontrado' }); res.json({ success: true, data }); } catch (e) { next(e); } };
exports.remove = async (req, res, next) => { try { const count = await model.remove(req.params.id); if (!count) return res.status(404).json({ success: false, error: 'Proveedor no encontrado' }); res.status(204).send(); } catch (e) { if (e.code === 'ER_ROW_IS_REFERENCED_2') e.status = 409; next(e); } };
