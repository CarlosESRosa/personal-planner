const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token não fornecido',
        message: 'É necessário fornecer um token de autenticação'
      });
    }

    // Verifica se o token está no formato correto
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ 
        error: 'Token mal formatado',
        message: 'O token deve estar no formato: Bearer <token>'
      });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        error: 'Token mal formatado',
        message: 'O token deve começar com "Bearer"'
      });
    }

    try {
      console.log('Verificando token:', token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decodificado:', decoded);

      if (!decoded.id) {
        console.log('Token não contém ID do usuário');
        return res.status(401).json({ 
          error: 'Token inválido',
          message: 'O token não contém informações válidas do usuário'
        });
      }

      const user = await userModel.findById(decoded.id);
      console.log('Usuário encontrado:', user);

      if (!user) {
        console.log('Usuário não encontrado para o ID:', decoded.id);
        return res.status(401).json({ 
          error: 'Usuário não encontrado',
          message: 'O usuário associado ao token não existe mais'
        });
      }

      // Adiciona o usuário à requisição
      req.user = user;
      return next();
    } catch (err) {
      console.error('Erro ao verificar token:', err);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expirado',
          message: 'O token de autenticação expirou'
        });
      }
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'O token fornecido não é válido'
      });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao processar a autenticação'
    });
  }
};

module.exports = authMiddleware;
