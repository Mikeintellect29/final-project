const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//  new doctor registration
router.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    specialization,
    email,
    phone,
    schedule,
    password,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO Doctors (first_name, last_name, specialization, email, phone, schedule, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      first_name,
      last_name,
      specialization,
      email,
      phone,
      schedule,
      hashedPassword,
    ];

    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error adding doctor", err);
        return res
          .status(500)
          .json({ message: "Error adding doctor", error: err.message });
      }
      res.status(200).json({ message: "Doctor added successfully" });
    });
  } catch (err) {
    console.error("Error hashing password:", err.message);
    res
      .status(500)
      .json({ message: "Error hashing password", error: err.message });
  }
});

//doctor login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email); // Log the email being used for login

  const query = `SELECT * FROM Doctors WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Database query error:", err); // Log database query error
      return res
        .status(500)
        .json({ message: "Error logging in doctor", error: err.message });
    }

    if (results.length === 0) {
      console.log("No user found for email:", email); // Log if no user is found
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const doctor = results[0];
    console.log("Doctor found:", doctor); // Log the retrieved user object

    try {
      // Compare the hashed password
      const isPasswordMatch = await bcrypt.compare(
        password,
        doctor.password_hash
      );

      console.log("Password match:", isPasswordMatch); // Log password match result

      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: doctor.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log("Login successful for doctor ID:", doctor.id); // Log successful login
      res.json({
        message: "Login successful",
        token: token,
        doctorId: doctor.id,
      });
    } catch (err) {
      console.error("Error comparing passwords:", err.message); // Log password comparison error
      res
        .status(500)
        .json({ message: "Error logging in doctor", error: err.message });
    }
  });
});

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Doctors route is working!" });
});

// Dashboard overview data
router.get("/dashboard", async (req, res) => {
  try {
    const doctorId = req.session.doctorId; // Or extract from JWT
    if (!doctorId) return res.status(401).json({ message: "Unauthorized" });

    // Fetch doctor's profile
    const [doctor] = await db.query(
      "SELECT first_name, last_name FROM Doctors WHERE id = ?",
      [doctorId]
    );

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Fetch today's schedule
    const today = new Date().toISOString().split("T")[0];
    const todaySchedule = await db.query(
      "SELECT id, time, patient_name FROM Appointments WHERE doctor_id = ? AND date = ?",
      [doctorId, today]
    );

    res.json({
      firstName: doctor.first_name,
      lastName: doctor.last_name,
      todaySchedule,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// Upcoming appointments
router.get("/appointments", async (req, res) => {
  try {
    const doctorId = req.session.doctorId; // Or extract from JWT
    if (!doctorId) return res.status(401).json({ message: "Unauthorized" });

    const upcomingAppointments = await db.query(
      "SELECT id, patient_name, time, status FROM Appointments WHERE doctor_id = ? AND date > NOW() ORDER BY date ASC",
      [doctorId]
    );

    res.json(upcomingAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// Patient history
router.get("/patient-history", async (req, res) => {
  try {
    const doctorId = req.session.doctorId; // Or extract from JWT
    if (!doctorId) return res.status(401).json({ message: "Unauthorized" });

    const patientHistory = await db.query(
      "SELECT id, name, last_consultation FROM Patients WHERE doctor_id = ?",
      [doctorId]
    );

    res.json(patientHistory);
  } catch (error) {
    console.error("Error fetching patient history:", error);
    res.status(500).json({ message: "Error fetching patient history" });
  }
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

router.get("/profile", (req, res) => {
  const doctorId = req.session.doctorId; // Or use JWT to extract the ID

  if (!doctorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = "SELECT first_name, last_name FROM Doctors WHERE id = ?";
  db.query(query, [doctorId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching doctor profile", error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      first_name: results[0].first_name,
      last_name: results[0].last_name,
    });
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
