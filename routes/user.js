const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/me', userCtrl.delete);
router.put('/me', userCtrl.modify);
router.get('/', auth, userCtrl.getAllUsers);
router.get('/me', userCtrl.getOneUser);

module.exports = router;