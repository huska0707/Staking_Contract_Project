const express = require('express');

const router = express.Router();

const { registerUser } = requrie('../controllers/userController')
router.route('/register').post(registerUser);

module.exports = router;