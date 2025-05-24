const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota pública - Registro de usuário
router.post('/register', authController.register);

// Rota pública - Login
router.post('/login', authController.login);

// Rota protegida - Validação de token
router.get('/validate', authMiddleware, authController.validateToken);

module.exports = router;
