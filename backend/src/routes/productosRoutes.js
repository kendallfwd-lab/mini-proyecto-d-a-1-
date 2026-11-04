const router = require('express').Router();
const controller = require('../controllers/productosController');
const validateProducto = require('../validators/productoValidator');
const { validateRequest, validateIdParam } = require('../middleware/validateRequest');

router.get('/', controller.list);
router.get('/:id', validateIdParam, controller.get);
router.post('/', validateRequest(validateProducto), controller.create);
router.put('/:id', validateIdParam, validateRequest(validateProducto), controller.update);
router.delete('/:id', validateIdParam, controller.remove);

module.exports = router;
