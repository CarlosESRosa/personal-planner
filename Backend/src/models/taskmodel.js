const db = require('./db');

class TaskModel {
  async getAll() {
    const { rows } = await db.query(`
      SELECT t.*, 
             p.name as priority_name, 
             p.color as priority_color,
             c.name as category_name,
             c.color as category_color
      FROM tasks t
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.start_datetime
    `);
    return rows;
  }

  async getById(id) {
    const { rows } = await db.query(`
      SELECT t.*, 
             p.name as priority_name,
             p.color as priority_color,
             c.name as category_name,
             c.color as category_color
      FROM tasks t
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1
    `, [id]);
    return rows[0];
  }

  async create(taskData) {
    const { title, start_datetime, end_datetime, priority_id, category_id } = taskData;
    const { rows } = await db.query(
      'INSERT INTO tasks (title, start_datetime, end_datetime, priority_id, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, start_datetime, end_datetime, priority_id, category_id]
    );
    return rows[0];
  }

  async update(id, taskData) {
    const { title, start_datetime, end_datetime, priority_id, category_id } = taskData;
    const { rows } = await db.query(
      'UPDATE tasks SET title = $1, start_datetime = $2, end_datetime = $3, priority_id = $4, category_id = $5 WHERE id = $6 RETURNING *',
      [title, start_datetime, end_datetime, priority_id, category_id, id]
    );
    return rows[0];
  }

  async remove(id) {
    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  async filter(filters) {
    let query = `
      SELECT t.*, 
             p.name as priority_name,
             p.color as priority_color,
             c.name as category_name,
             c.color as category_color
      FROM tasks t
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.priority_id) {
      query += ` AND t.priority_id = $${paramCount}`;
      values.push(filters.priority_id);
      paramCount++;
    }

    if (filters.category_id) {
      query += ` AND t.category_id = $${paramCount}`;
      values.push(filters.category_id);
      paramCount++;
    }

    if (filters.start_date) {
      query += ` AND DATE(t.start_datetime) = $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      query += ` AND DATE(t.end_datetime) = $${paramCount}`;
      values.push(filters.end_date);
      paramCount++;
    }

    query += ' ORDER BY t.start_datetime';

    const { rows } = await db.query(query, values);
    return rows;
  }

  // Métodos para gerenciar prioridades
  async getAllPriorities() {
    const { rows } = await db.query('SELECT * FROM priorities ORDER BY name');
    return rows;
  }

  // Métodos para gerenciar categorias
  async getAllCategories() {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY name');
    return rows;
  }
}

module.exports = new TaskModel();
