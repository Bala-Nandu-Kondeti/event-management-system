const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');

router.get('/', (req, res) => {
    db.query('SELECT * FROM events', (err, results) => {
        res.json(results);
    });
});

router.post('/create', (req, res) => {
    const { title, description, event_date, event_time, venue, image, created_by } = req.body;
    db.query(
        'INSERT INTO events VALUES (NULL,?,?,?,?,?,?,NOW())',
        [title, description, event_date, event_time, venue, image, created_by],
        () => res.send('Event Created')
    );
});



module.exports = router;