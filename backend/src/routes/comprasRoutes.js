const router = require('express').Router();
const controller = require('../controllers/comprasController');
const validateCompra = require('../validators/compraValidator');
const { validateRequest, validateIdParam } = require('../middleware/validateRequest');

router.get('/', controller.list);
router.get('/:id', validateIdParam, controller.get);
router.post('/', validateRequest(validateCompra.create), controller.create);
router.post('/:id/recibir', validateIdParam, validateRequest(validateCompra.receive), controller.receive);

module.exports = router;
