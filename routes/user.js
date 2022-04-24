const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/me', auth, userCtrl.delete);
router.put('/me', auth, userCtrl.modify);
router.get('/', auth, userCtrl.getAllUsers);
router.get('/me', auth, userCtrl.getOneUser);

module.exports = router;