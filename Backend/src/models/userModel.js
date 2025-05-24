const db = require('./db');

class UserModel {
  async create({ name, email, password }) {
    console.log('Model :::', name, email, password);
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, password]
    );
    console.log('Model :::', rows[0]);
    return rows[0];
  }

  async findByEmail(email) {
    console.log('Model :::', email);
    const { rows } = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return rows[0];
  }

  async findById(id) {
    const { rows } = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  }
}

module.exports = new UserModel();
