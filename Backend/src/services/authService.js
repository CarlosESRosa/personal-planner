const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/userModel")
require('dotenv').config();

class AuthService {
  async validateUserData(userData) {
    const { email, password, name } = userData;

    if (!name || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios');
    }

    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    if (name.length < 3) {
      throw new Error('O nome deve ter pelo menos 3 caracteres');
    }
  }

  async register(userData) {
    await this.validateUserData(userData);
    const { email, password, name } = userData;
    console.log('user data ', email, password, name );
    
    // Verifica se o usuário já existe
    const existingUser = await UserModel.findByEmail({ email });
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Cria hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria novo usuário
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword
    });

    // Remove a senha do objeto retornado
    console.log('user :::', user);
    const userWithoutPassword = { ...user };
    console.log('userWithoutPassword :::', userWithoutPassword);
    delete userWithoutPassword.password;

    return userWithoutPassword;
  }

  async login(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Busca usuário
    console.log('credentials :::', email, password);
    console.log('{ email } :::', { email });
    const user = await UserModel.findByEmail(email);
    console.log('user :::', user);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Senha inválida');
    }

    // Gera token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove a senha do objeto retornado
    console.log('user to remove password :::', user);
    const userWithoutPassword = { ...user };
    console.log('userWithoutPassword :::', userWithoutPassword);
    delete userWithoutPassword.password;

    return { user: userWithoutPassword, token };
  }

  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Remove a senha do objeto retornado
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return userWithoutPassword;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

module.exports = new AuthService();
