const express = require("express");
const router = express.Router();
const db = require("../db");

//  new doctor registration
router.post("/", (req, res) => {
  const { first_name, last_name, specialization, email, phone, schedule } =
    req.body;

  const query = `INSERT INTO Doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(
    query,
    [first_name, last_name, specialization, email, phone, schedule],
    (err, results) => {
      if (err) {
        console.error("Error assing doctor", err);
        return res
          .status(500)
          .json({ message: "Error adding doctor", error: err.message });
      }
      res.status(200).json({ message: "Doctor added successfully" });
    }
  );
});

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Doctors route is working!" });
});

// Get list of doctors
router.get("/list", (req, res) => {
  const { specialization, location } = req.query;

  const query = `SELECT id, CONCAT(first_name, " ", last_name) AS name, specialization, location, phone, schedule FROM Doctors WHERE 1=1`;
  const queryParams = [];

  // Add specialization filter if provided
  if (specialization) {
    query += ` AND specialization LIKE ?`;
    queryParams.push(`%${specialization}%`);
  }

  // Add location filter if provided
  if (location) {
    query += ` AND location LIKE ?`;
    queryParams.push(`%${location}%`);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res
        .status(500)
        .json({ message: "Error fetching doctors", error: err.message });
    }
    res.json(results);
  });
});

// Update doctor profile
router.put("/:id", (req, res) => {
  const doctorId = req.params.id;
  const { first_name, last_name, specialization, email, phone, schedule } =
    req.body;

  const query = `UPDATE Doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ?, schedule = ? WHERE id = ?`;
  db.query(
    query,
    [first_name, last_name, specialization, email, phone, schedule, doctorId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error updating doctor" });
      }
      res.json({ message: "Doctor updated successfully" });
    }
  );
});

// Delete doctor profile
router.delete("/:id", (req, res) => {
  const doctorId = req.params.id;

  const query = `DELETE FROM Doctors WHERE id = ?`;
  db.query(query, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting doctor" });
    }
    res.json({ message: "Doctor deleted successfully" });
  });
});

module.exports = router;
