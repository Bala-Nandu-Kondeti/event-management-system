const upload = require('../middleware/upload');
const isAdmin = require('../middleware/isAdmin');

router.post('/create', isAdmin, upload.single('image'), (req, res) => {
    const { title, description, event_date, event_time, venue } = req.body;
    const image = req.file.filename;

    db.query(
        `INSERT INTO events 
        (title, description, event_date, event_time, venue, image, created_at)
        VALUES (?,?,?,?,?,?,NOW())`,
        [title, description, event_date, event_time, venue, image],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Event created with image" });
        }
    );
});
router.post('/create', isAdmin, upload.single('image'), (req, res) => {
    console.log("SESSION:", req.session.user);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    res.json({ message: "Reached backend" });
});
console.log("SESSION:", req.session.user);
console.log("FILE:", req.file);
app.get("/events", (req, res) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    db.query(
        "SELECT * FROM events WHERE event_date >= ? ORDER BY event_date ASC",
        [today],
        (err, events) => {
            if (err) return res.send("Database error");
            res.render("events", {
                events,               // send events to EJS
                isAdmin: req.session.user?.role === "admin"
            });
        }
    );
});
