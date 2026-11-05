const router = require('express').Router();
const controller = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const { validateRegister, validateLogin } = require('../validators/authValidator');

router.post('/login', validateRequest(validateLogin), controller.login);
router.get('/me', auth, controller.me);
router.post('/logout', auth, controller.logout);
module.exports = router;
