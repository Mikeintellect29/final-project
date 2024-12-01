const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const db = require("../db");

//patient registration

router.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    date_of_birth,
    gender,
    address,
  } = req.body;

  //hash the password
  try {
    const password_hash = await bcrypt.hash(password, 8);

    const query = `INSERT INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(
      query,
      [
        first_name,
        last_name,
        email,
        password_hash,
        phone,
        date_of_birth,
        gender,
        address,
      ],
      (err, results) => {
        if (err) {
          console.error("error executing query: ", err);
          return res
            .status(500)
            .json({ message: "Error registering patient", error: err.message });
        }
        res.status(201).json({ message: "Patient registered successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Patient Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM Patients WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ message: "Error logging in patient", error: err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      results[0].password_hash
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    req.session.patientId = results[0].id;

    const token = jwt.sign(
      {
        id: results[0].id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token: token,
      patientId: results[0].id,
    });
  });
});

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage: storage });

// Middleware to check if the user is logged in (authentication)
const isAuthenticated = (req, res, next) => {
  if (!req.session.patientId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Get patient profile
router.get("/profile", isAuthenticated, (req, res) => {
  const patientId = req.session.patientId;
  const query = "SELECT * FROM Patients WHERE id = ?";
  db.query(query, [patientId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching profile" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.render("patient-profile", { patient: results[0] });
  });
});

// Update patient profile (including profile picture)
router.put(
  "/update-profile",
  isAuthenticated,
  upload.single("profilePic"),
  (req, res) => {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    console.log("Session Patient ID:", req.session.patientId);

    const patientId = req.session.patientId;
    if (!patientId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const { firstName, lastName, email, phone, address, dob } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
    UPDATE Patients 
    SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, dob = ?, profile_pic = ?
    WHERE id = ?
  `;
    const params = [
      firstName,
      lastName,
      email,
      phone,
      address,
      dob,
      profilePic,
      patientId,
    ];

    db.query(query, params, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating profile" });
      }
      res.status(200).json({ message: "Profile updated successfully" });
    });
  }
);

// Patient Logout
router.get("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Error logging out" });
    }

    res.json({ message: "Logout successful" });
  });
});

module.exports = router;
