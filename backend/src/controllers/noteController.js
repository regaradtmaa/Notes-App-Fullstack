const pool = require('../config/db');

const getNotes = async (req, res) => {
    try {
        const [notes] = await pool.query('SELECT * FROM notes WHERE userId = ? ORDER BY updatedAt DESC', [req.params.userId]);
        res.json({ success: true, data: notes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const createNote = async (req, res) => {
    try {
        const { userId, title, content } = req.body;
        const id = Date.now().toString();
        const timestamp = Date.now();
        await pool.query('INSERT INTO notes (id, userId, title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', 
            [id, userId, title, content, timestamp, timestamp]);
        res.json({ success: true, message: 'Catatan ditambahkan' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getNotes, createNote };