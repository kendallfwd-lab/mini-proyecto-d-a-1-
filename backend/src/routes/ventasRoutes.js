const router = require('express').Router();
const controller = require('../controllers/ventasController');
const validateVenta = require('../validators/ventaValidator');
const { validateRequest } = require('../middleware/validateRequest');

router.get('/', controller.list);
router.post('/', validateRequest(validateVenta), controller.create);

module.exports = router;
