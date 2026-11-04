const router = require('express').Router();
const controller = require('../controllers/gastosController');
const validateGasto = require('../validators/gastoValidator');
const { validateRequest, validateIdParam } = require('../middleware/validateRequest');

router.get('/', controller.list);
router.post('/', validateRequest(validateGasto), controller.create);
router.put('/:id', validateIdParam, validateRequest(validateGasto), controller.update);
router.delete('/:id', validateIdParam, controller.remove);

module.exports = router;
