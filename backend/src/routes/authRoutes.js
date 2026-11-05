const router = require('express').Router();
const controller = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const csrf = require('../middleware/csrfMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const { validateRegister, validateLogin } = require('../validators/authValidator');

router.post('/login', validateRequest(validateLogin), controller.login);
router.post('/refresh', csrf.refresh, controller.refresh);
router.get('/me', auth, controller.me);
router.post('/logout', auth, csrf, controller.logout);
module.exports = router;
