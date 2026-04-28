require('dotenv').config();
const app = require('./app');
const initializeDatabase = require('./config/initDb');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Gagal start server:', error);
        process.exit(1);
    }
}

startServer();