const router = require('express').Router();
const controller = require('../controllers/clientesController');
const validateCliente = require('../validators/clienteValidator');
const { validateRequest, validateIdParam } = require('../middleware/validateRequest');

router.get('/', controller.list);
router.get('/:id', validateIdParam, controller.get);
router.post('/', validateRequest(validateCliente), controller.create);
router.put('/:id', validateIdParam, validateRequest(validateCliente), controller.update);
router.delete('/:id', validateIdParam, controller.remove);

module.exports = router;
