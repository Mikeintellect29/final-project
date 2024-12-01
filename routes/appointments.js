const express = require("express");
const router = express.Router();
const db = require("../db");

// Book an appointment

// Route to book an appointment
router.post("/book", async (req, res) => {
  const { doctor_id, appointment_date, appointment_time } = req.body;

  if (!doctor_id || !appointment_date || !appointment_time || !patient_id) {
    return res.status(400).json({
      message:
        "All fields ( doctor_id, appointment_date, appointment_time) are required.",
    });
  }

  try {
    const result = await db.promise().query(
      `INSERT INTO Appointments ( doctor_id, appointment_date, appointment_time, status)
       VALUES ( ?, ?, ?, ?)`,
      [doctor_id, appointment_date, appointment_time, "scheduled"]
    );
    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Failed to book the appointment." });
  }
});

// View upcoming appointments for a patient
router.get("/:patient_id", (req, res) => {
  const patientId = req.params.patient_id;

  const query = `SELECT * FROM Appointments WHERE patient_id = ? AND status = 'scheduled'`;
  db.query(query, [patientId], (err, results) => {
    if (err) {
      console.error("Error fetching appointment", err);

      return res
        .status(500)
        .json({ message: "Error fetching appointments", error: err.message });
    }
    res.json(results);
  });
});

// Update an appointment (reschedule or cancel)
router.put("/:id", (req, res) => {
  const appointmentId = req.params.id;
  const { appointment_date, appointment_time, status } = req.body;

  const query = `UPDATE Appointments SET appointment_date = ?, appointment_time = ?, status = ? WHERE id = ?`;
  db.query(
    query,
    [appointment_date, appointment_time, status, appointmentId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error updating appointment" });
      }
      res.json({ message: "Appointment updated successfully" });
    }
  );
});

// Delete (cancel) an appointment
router.delete("/:id", (req, res) => {
  const appointmentId = req.params.id;

  const query = `UPDATE Appointments SET status = 'canceled' WHERE id = ?`;
  db.query(query, [appointmentId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error canceling appointment" });
    }
    res.json({ message: "Appointment canceled successfully" });
  });
});

module.exports = router;
