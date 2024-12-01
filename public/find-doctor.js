document
  .getElementById("searchForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const specialization = document.getElementById("specialty").value;
    const location = document.getElementById("location").value;

    // Fetch doctors based on the search filters
    try {
      const response = await fetch(
        `/doctors/list?specialization=${specialization}&location=${location}`
      );
      const doctors = await response.json();
      displayDoctors(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  });

function displayDoctors(doctors) {
  const doctorList = document.getElementById("doctorList");
  doctorList.innerHTML = "";

  if (doctors.length === 0) {
    doctorList.innerHTML = "<p>No doctors found.</p>";
    return;
  }

  doctors.forEach((doctor) => {
    const doctorCard = `
          <div class="doctor-card">
              <h3>${doctor.first_name} ${doctor.last_name}</h3>
              <p>Specialty: ${doctor.specialization}</p>
              <p>Location: ${doctor.location}</p>
              <p>Schedule: ${doctor.schedule}</p>
              <p>Contact: ${doctor.phone}</p>
              <button onclick="bookAppointment('${doctor.id}')">Book Appointment</button>
          </div>
      `;
    doctorList.innerHTML += doctorCard;
  });
}

function bookAppointment(doctorId) {
  alert(`Booking appointment with doctor ID: ${doctorId}`);
}
