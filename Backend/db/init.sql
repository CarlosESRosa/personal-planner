-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL CHECK (color ~ '^#([A-Fa-f0-9]{6})$')
);

-- Tabela de prioridades
CREATE TABLE IF NOT EXISTS priorities (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL CHECK (color ~ '^#([A-Fa-f0-9]{6})$')
);

-- Tabela de tarefas (com referência ao usuário)
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  priority_id INTEGER NOT NULL REFERENCES priorities(id) ON DELETE RESTRICT,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Valores iniciais
INSERT INTO categories (name, color)
VALUES
  ('Estudo', '#1E90FF'),
  ('Trabalho', '#228B22'),
  ('Treino', '#FF8C00')
ON CONFLICT (name) DO NOTHING;

INSERT INTO priorities (name, color)
VALUES
  ('Muito importante', '#FF0000'),
  ('Importante', '#FFA500'),
  ('Normal', '#228B22')
ON CONFLICT (name) DO NOTHING;
