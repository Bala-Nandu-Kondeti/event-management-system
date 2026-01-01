
router.post('/join', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const user_id = req.session.user.id;
    const { event_id } = req.body;

    db.query(
        'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
        [user_id, event_id],
        (err) => {
            if (err) {
                console.error(err);
                return res.send('Event registration failed');
            }

            // ✅ SHOW SUCCESS PAGE
            res.render('event-success');
        }
    );
});
