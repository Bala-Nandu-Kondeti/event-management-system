const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ================= SESSION ================= */
app.use(
  session({
    secret: "college_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

/* ================= DATABASE ================= */
const db = mysql.createConnection({
  host:process.env.DB_HOST||"localhost",
  user: process.env.DB_USER||"root",
  password: process.env.DB_PASSWORD||"root", // change if needed
  database:process.env.DB_NAME|| "college_events",
  port:process.env.DB_PORT||3306
});

db.connect(err => {
  if (err) console.error("DB connection failed:", err);
  else console.log("MySQL connected");
});

/* ================= ADMIN MIDDLEWARE ================= */
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") return next();
  res.send("Access denied");
}

/* ================= LOGIN ROUTES ================= */
app.get("/login", (req, res) => res.render("login"));

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, users) => {
      if (err) return res.send("DB error");
      if (users.length === 0) return res.send("Invalid login");

      req.session.user = { id: users[0].id, role: users[0].role };
      res.redirect("/events");
    }
  );
});
app.post("/register", (req, res) => {
  const { event_id, name, email } = req.body; // get data from form

  // Save registration in DB
  db.query(
    "INSERT INTO registrations (event_id, name, email) VALUES (?, ?, ?)",
    [event_id, name, email],
    err => {
      if (err) return res.send("Registration failed");
      res.send("Registered successfully!");
    }
  );
});


/* ================= ROUTES ================= */
app.get("/", (req, res) => res.render("server is running"));

app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, events) => {
    if (err) return res.send("Database error");
    res.render("events", {
      events,
      isAdmin: req.session.user?.role === "admin"
    });
  });
});


/* ADMIN DASHBOARD */
app.get("/admin", isAdmin, (req, res) => {
  db.query("SELECT * FROM events", (err, events) => {
    if (err) return res.send("Database error");
    res.render("admin", { events });
  });
});

/* ADD EVENT */
app.post("/add-event", isAdmin, (req, res) => {
  const { title, description, event_date, event_time, venue, image } = req.body;
  db.query(
    "INSERT INTO events (title, description, event_date, event_time, venue, image) VALUES (?, ?, ?, ?, ?, ?)",
    [title, description, event_date, event_time, venue, image],
    err => {
      if (err) return res.send("Insert failed");
      res.redirect("/admin");
    }
  );
});

/* EDIT EVENT PAGE */
app.get("/edit/:id", isAdmin, (req, res) => {
  db.query("SELECT * FROM events WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.send("Database error");
    if (result.length === 0) return res.send("Event not found");
    res.render("edit", { event: result[0] });
  });
});

/* UPDATE EVENT */
app.post("/edit/:id", isAdmin, (req, res) => {
  const { title, description, event_date, event_time, venue, image } = req.body;
  db.query(
    "UPDATE events SET title=?, description=?, event_date=?, event_time=?, venue=?, image=? WHERE id=?",
    [title, description, event_date, event_time, venue, image, req.params.id],
    err => {
      if (err) return res.send("Update failed");
      res.redirect("/admin");
    }
  );
});

/* DELETE EVENT */
app.get("/delete/:id", isAdmin, (req, res) => {
  db.query("DELETE FROM events WHERE id=?", [req.params.id], err => {
    if (err) return res.send("Delete failed");
    res.redirect("/admin");
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

