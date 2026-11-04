const router = require('express').Router();
const controller = require('../controllers/dashboardController');

router.get('/resumen', controller.summary);
router.get('/analiticas', controller.analytics);
router.get('/rentabilidad', controller.profitability);

module.exports = router;
