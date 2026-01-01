router.post('/join', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const user_id = req.session.user.id;
    const { event_id } = req.body;

    console.log("JOIN EVENT:", user_id, event_id); // 👈 ADD THIS

    db.query(
        'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
        [user_id, event_id],
        (err) => {
            if (err) {
                console.error("DB ERROR 👉", err); // 👈 VERY IMPORTANT
                return res.send('Event registration failed');
            }

            res.render('event-success');
        }
    );
});
