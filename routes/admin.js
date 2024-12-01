const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../db");

// Admin Registration
router.post("/register", (req, res) => {
  const { username, password, role } = req.body;

  const password_hash = bcrypt.hashSync(password, 8);
  const query = `INSERT INTO Admin (username, password_hash, role) VALUES (?, ?, ?)`;
  db.query(query, [username, password_hash, role], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error registering admin" });
    }
    res.status(201).json({ message: "Admin registered successfully" });
  });
});

// Admin Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM Admin WHERE username = ?`;
  db.query(query, [username], (err, results) => {
    if (
      err ||
      results.length === 0 ||
      !bcrypt.compareSync(password, results[0].password_hash)
    ) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.session.adminId = results[0].id; // Start session for admin
    res.json({ message: "Login successful", adminId: results[0].id });
  });
});

// Admin can view all appointments
router.get("/appointments", (req, res) => {
  const query = `SELECT * FROM Appointments`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching appointments" });
    }
    res.json(results);
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.redirect("/login");
  });
});

module.exports = router;
