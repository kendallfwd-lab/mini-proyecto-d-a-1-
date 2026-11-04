const router = require('express').Router();
const controller = require('../controllers/facturasController');
const { validateIdParam } = require('../middleware/validateRequest');

router.get('/', controller.list);
router.get('/:id', validateIdParam, controller.get);

module.exports = router;
