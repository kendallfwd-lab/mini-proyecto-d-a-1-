const router = require('express').Router();
const controller = require('../controllers/categoriasController');
const validateCategoria = require('../validators/categoriaValidator');
const { validateRequest, validateIdParam } = require('../middleware/validateRequest');

router.get('/', controller.list);
router.get('/:id', validateIdParam, controller.get);
router.post('/', validateRequest(validateCategoria), controller.create);
router.put('/:id', validateIdParam, validateRequest(validateCategoria), controller.update);
router.delete('/:id', validateIdParam, controller.remove);

module.exports = router;
