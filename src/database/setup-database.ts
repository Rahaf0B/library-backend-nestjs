import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

export async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT),
  });

  const dbNames = [
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_DATABASE_BOOK_TEST,
    process.env.MYSQL_DATABASE_CATEGORY_TEST,
    process.env.MYSQL_DATABASE_AUTHOR_TEST,
  ];

  for (const dbName of dbNames) {
    // Check if the database exists and creates it if it does not
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
  }
  await connection.end();
}
