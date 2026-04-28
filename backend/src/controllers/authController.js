const pool = require('../config/db');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const id = Date.now().toString();
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });

        await pool.query('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)', [id, name, email, password]);
        res.json({ success: true, data: { id, name, email }, message: 'Registrasi berhasil' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length === 0) return res.status(401).json({ success: false, message: 'Email atau password salah!' });
        res.json({ success: true, data: { id: users[0].id, name: users[0].name, email: users[0].email }, message: 'Login berhasil' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { register, login };