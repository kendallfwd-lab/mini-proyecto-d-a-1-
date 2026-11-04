const router = require('express').Router();
const controller = require('../controllers/proveedoresController');
const validateProveedor = require('../validators/proveedorValidator');
const { validateRequest, validateIdParam } = require('../middleware/validateRequest');

router.get('/', controller.list);
router.get('/:id', validateIdParam, controller.get);
router.post('/', validateRequest(validateProveedor), controller.create);
router.put('/:id', validateIdParam, validateRequest(validateProveedor), controller.update);
router.delete('/:id', validateIdParam, controller.remove);

module.exports = router;
