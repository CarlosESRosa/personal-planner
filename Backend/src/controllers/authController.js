const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        user
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        error: error.message,
        message: 'Não foi possível criar o usuário'
      });
    }
  }

  async login(req, res) {
    try {
      const { user, token } = await authService.login(req.body);
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        user,
        token
      });
    } catch (error) {
      res.status(401).json({ 
        success: false,
        error: error.message,
        message: 'Credenciais inválidas'
      });
    }
  }

  async validateToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ 
          success: false,
          error: 'Token não fornecido',
          message: 'É necessário fornecer um token de autenticação'
        });
      }

      const token = authHeader.split(' ')[1];
      const user = await authService.validateToken(token);
      
      res.json({
        success: true,
        message: 'Token válido',
        user
      });
    } catch (error) {
      res.status(401).json({ 
        success: false,
        error: error.message,
        message: 'Token inválido ou expirado'
      });
    }
  }
}

module.exports = new AuthController();
