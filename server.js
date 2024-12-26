// import necessary package
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const cors = require("cors");
const bodyParser = require("body-parser");
const MySQLStore = require("connect-mysql2")(session);

require("dotenv").config();

// initialize app
const app = express();
const port = 3800;

const db = require("./db");

// middleware to parse json
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// use cors middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-Type", "Authorization", "Accept"],
    credentials: true,
  })
);

const sessionStore = new MySQLStore({ pool: db });

app.use(
  session({
    key: "sessionId",
    secret: process.env.SESSION_SECRET || "sessionSecret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 60 * 60 * 1000 },
  })
);

//route

const patientsRoutes = require("./routes/patients");
const doctorsRoutes = require("./routes/doctors");
const appointmentsRoutes = require("./routes/appointments");
const adminRoutes = require("./routes/admin");

app.use("/patients", patientsRoutes);
app.use("/doctors", doctorsRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack); // Log stack trace for unhandled errors
  res.status(500).json({ message: "An unexpected error occurred" });
});

// // Default Route
// app.get("/", (req, res) => {
//   res.send("Welcome to the Telemedicine API");
// });

app.get("/register", (req, res) => {
  res.render("registration");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/appointment", (req, res) => {
  res.render("appointment");
});

app.get("/find-doctor", (req, res) => {
  res.render("find-doctor");
});

// Add a route to render the logout page
app.get("/logout", (req, res) => {
  // End the session to log the user out
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to log out.");
    }
    // Render the logout page
    res.render("logout");
  });
});

app.get("/profile", (req, res) => {
  if (!req.session.patientId) {
    return res.redirect("/login"); // Redirect to login if no patient is logged in
  }

  const patientId = req.session.patientId;

  // Query the database for the patient information using the patientId from session
  const query = "SELECT * FROM Patients WHERE id = ?";
  db.query(query, [patientId], (err, results) => {
    if (err) {
      console.error("Error fetching profile data:", err);
      return res.status(500).json({ message: "Error fetching profile data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.render("profile", { patient: results[0] });
  });
});

app.get("/doc-login", (req, res) => {
  res.render("doc-login");
});

app.get("/doc-register", (req, res) => {
  res.render("doc-register");
});

app.get("/doc-dashboard", (req, res) => {
  res.render("doc-dashboard");
});

app.get("/doc-appointment", (req, res) => {
  res.render("doc-appointment");
});

app.get("/doc-patient-history", (req, res) => {
  res.render("doc-patient-history");
});

app.get("/doc-profile", (req, res) => {
  res.render("doc-profile");
});

app.get("/admin-appointments", (req, res) => {
  res.render("admin-appointments");
});

app.get("/admin-dashboard", (req, res) => {
  res.render("admin-dashboard");
});

app.get("/admin-login", (req, res) => {
  res.render("admin-login");
});

app.get("/admin-register", (req, res) => {
  res.render("admin-register");
});
// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "./views"); //  HTML files are in the 'views' folder

// Example route
app.get("/", (req, res) => {
  res.render("landing-page"); // it will look for 'views/index.ejs'
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//export the connection

module.exports = db;
