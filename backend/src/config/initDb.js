const pool = require('./db');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    try {
        // Buat database jika belum ada
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'notes_db'}\`;`);
        await connection.end();

        // Buat tabel menggunakan pool
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(100) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(100)
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notes (
                id VARCHAR(100) PRIMARY KEY, userId VARCHAR(100), title VARCHAR(255), content TEXT, createdAt BIGINT, updatedAt BIGINT
            )
        `);
        console.log("Database dan tabel siap");
    } catch (error) {
        console.error("Gagal inisialisasi database:", error);
    }
}

module.exports = initializeDatabase;