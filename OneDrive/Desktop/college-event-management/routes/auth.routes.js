const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        () => res.send('User Registered')
    );
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query(
        'SELECT * FROM users WHERE email=? AND password=?',
        [email, password],
        (err, result) => {
            if (result.length > 0) res.send('Login Successful');
            else res.status(401).send('Invalid Credentials');
        }
    );
});

module.exports = router;
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email=? AND password=?';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'DB error' });
        }

        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});
