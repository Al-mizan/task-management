import mysql from 'mysql2/promise';

import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT } from './env.js';

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(DB_CONNECTION_LIMIT),
  queueLimit: 0
});

export default pool;
