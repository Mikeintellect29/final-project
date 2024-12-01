async function submitAppointment() {
  // Get form field values
  const appointmentId = document.getElementById("appointmentId").value;
  const doctorId = document.getElementById("doctor").value;
  const appointmentDate = document.getElementById("date").value;
  const appointmentTime = document.getElementById("time").value;

  // Dynamically get the patient ID (replace this with actual logic)
  const patientId = localStorage.getItem("patient_id"); // Example: from localStorage
  // Error message container
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");

  // Clear previous messages
  errorMessage.style.display = "none";
  successMessage.style.display = "none";

  // Validate fields
  if (!doctorId) {
    errorMessage.textContent = "Please select a doctor.";
    errorMessage.style.display = "block";
    return;
  }
  if (!appointmentDate) {
    errorMessage.textContent = "Please select an appointment date.";
    errorMessage.style.display = "block";
    return;
  }
  if (!appointmentTime) {
    errorMessage.textContent = "Please select an appointment time.";
    errorMessage.style.display = "block";
    return;
  }

  if (!patientId) {
    errorMessage.textContent = "Patient ID is missing. Please log in again.";
    errorMessage.style.display = "block";
    return;
  }

  // Create the data payload
  const formData = {
    appointment_id: appointmentId || null, // Only include this if updating an appointment
    doctor_id: doctorId,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    patient_id: patientId,
  };

  try {
    // Send request to the backend
    const response = await fetch("/appointments/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      successMessage.textContent = "Appointment saved successfully!";
      successMessage.style.display = "block";
    } else {
      errorMessage.textContent =
        result.message || "Failed to save the appointment.";
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error saving appointment:", error);
    errorMessage.textContent = "An error occurred. Please try again.";
    errorMessage.style.display = "block";
  }
}

// Function to fetch and populate doctors
async function loadDoctors() {
  const doctorSelect = document.getElementById("doctor");

  try {
    const response = await fetch("/doctors/list");
    const doctors = await response.json();

    // Clear existing options
    doctorSelect.innerHTML = '<option value="">-- Select Doctor --</option>';

    // Populate dropdown with doctors from the database
    doctors.forEach((doctor) => {
      const option = document.createElement("option");
      option.value = doctor.id; // Use the doctor ID as the value
      option.textContent = `${doctor.name} (${doctor.specialization})`; // Use the doctor name as the text
      doctorSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", loadDoctors);

if (doctors.length === 0) {
  const option = document.createElement("option");
  option.value = "";
  option.textContent = "No doctors available";
  doctorSelect.appendChild(option);
}
