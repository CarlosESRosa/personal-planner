const { Pool } = require('pg');
require('dotenv').config();

console.log('process.env.DB_USER :::', process.env.DB_USER);
console.log('process.env.DB_HOST :::', process.env.DB_HOST);
console.log('process.env.DB_NAME :::', process.env.DB_NAME);
console.log('process.env.DB_PASSWORD :::', process.env.DB_PASSWORD);
console.log('process.env.DB_PORT :::', process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
