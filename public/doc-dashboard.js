document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display dashboard overview
  fetchDashboardData();

  // Fetch and display upcoming appointments
  fetchAppointments();

  // Fetch and display patient history
  fetchPatientHistory();
});

// Function to fetch dashboard data
async function fetchDashboardData() {
  try {
    const response = await fetch("/doctor/dashboard");
    if (!response.ok) throw new Error("Failed to fetch dashboard data");

    const data = await response.json();

    // Update welcome message
    document.querySelector(
      ".overview h2"
    ).textContent = `Welcome, Dr. ${data.firstName} ${data.lastName}`;

    // Populate today's schedule
    const appointmentsList = document.querySelector(".appointments-list");
    appointmentsList.innerHTML = ""; // Clear existing list
    data.todaySchedule.forEach((appointment) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <strong>${appointment.time}</strong> - Consultation with ${appointment.patientName}
        <button class="start-btn" onclick="startConsultation('${appointment.id}')">Start</button>`;
      appointmentsList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
}

// Function to fetch upcoming appointments
async function fetchAppointments() {
  try {
    const response = await fetch("/doctor/appointments");
    if (!response.ok) throw new Error("Failed to fetch appointments");

    const appointments = await response.json();

    const appointmentsSection = document.querySelector(".appointments-section");
    appointmentsSection.innerHTML = "<h3>Upcoming Appointments</h3>"; // Clear and reset section
    appointments.forEach((appointment) => {
      const card = document.createElement("div");
      card.className = "appointment-card";
      card.innerHTML = `
        <p><strong>Patient:</strong> ${appointment.patientName}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Status:</strong> ${appointment.status}</p>
        <button class="view-details-btn" onclick="viewAppointmentDetails('${appointment.id}')">View Details</button>`;
      appointmentsSection.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
}

// Function to fetch patient history
async function fetchPatientHistory() {
  try {
    const response = await fetch("/doctor/patient-history");
    if (!response.ok) throw new Error("Failed to fetch patient history");

    const history = await response.json();

    const historySection = document.querySelector(".patient-history-section");
    historySection.innerHTML = "<h3>Patient History</h3>"; // Clear and reset section
    history.forEach((patient) => {
      const card = document.createElement("div");
      card.className = "patient-card";
      card.innerHTML = `
        <p><strong>Name:</strong> ${patient.name}</p>
        <p><strong>Last Consultation:</strong> ${patient.lastConsultation}</p>
        <button class="view-records-btn" onclick="viewPatientRecords('${patient.id}')">View Records</button>`;
      historySection.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching patient history:", error);
  }
}

// Placeholder function for starting a consultation
function startConsultation(appointmentId) {
  alert(`Starting consultation for appointment ID: ${appointmentId}`);
  // Redirect to consultation page or open video interface
}

// Placeholder function for viewing appointment details
function viewAppointmentDetails(appointmentId) {
  alert(`Viewing details for appointment ID: ${appointmentId}`);
  // Fetch and display detailed appointment information
}

// Placeholder function for viewing patient records
function viewPatientRecords(patientId) {
  alert(`Viewing records for patient ID: ${patientId}`);
  // Redirect to patient records page or fetch and display records
}
