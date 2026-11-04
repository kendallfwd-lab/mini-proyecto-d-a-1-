const router = require('express').Router();
const controller = require('../controllers/dashboardController');

router.get('/resumen', controller.summary);
router.get('/analiticas', controller.analytics);

module.exports = router;
