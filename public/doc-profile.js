document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  updateDashboardWelcome(); // Add this function for the dashboard greeting
});

function loadProfile() {
  // Retrieve token from localStorage (or sessionStorage/cookies, depending on your implementation)
  const token = localStorage.getItem("jwtToken"); // Adjust if stored differently

  if (!token) {
    console.error("No token found. User might not be authenticated.");
    window.location.href = "/doc-login";
    // Optionally redirect to login or show an error
    return;
  }

  fetch("/doctors/doc-profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("display-first-name").innerText =
        data.first_name || "";
      document.getElementById("display-last-name").innerText =
        data.last_name || "";
      document.getElementById("display-email").innerText = data.email || "";
      document.getElementById("display-phone").innerText = data.phone || "";
      document.getElementById("display-dob").innerText =
        data.date_of_birth || "";
      document.getElementById("display-gender").innerText = data.gender || "";
      document.getElementById("display-address").innerText = data.address || "";

      document.getElementById("first_name").value = data.first_name || "";
      document.getElementById("last_name").value = data.last_name || "";
      document.getElementById("phone").value = data.phone || "";
      document.getElementById("date_of_birth").value = data.date_of_birth || "";
      document.getElementById("gender").value = data.gender || "";
      document.getElementById("address").value = data.address || "";

      document.getElementById("profile-section").style.display = "block";
    })
    .catch((error) => console.error("Error loading profile:", error));
}

function enableEdit() {
  document.getElementById("profile-section").style.display = "none";
  document.getElementById("edit-section").style.display = "block";
}

function cancelEdit() {
  document.getElementById("profile-section").style.display = "block";
  document.getElementById("edit-section").style.display = "none";
}

function saveProfile() {
  const token = localStorage.getItem("jwtToken"); // Get the JWT token

  if (!token) {
    console.error("No token found. Redirecting to login...");
    window.location.href = "/doc-login"; // Redirect to login if token is missing
    return;
  }
  const updatedData = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    phone: document.getElementById("phone").value,
    date_of_birth: document.getElementById("date_of_birth").value,
    gender: document.getElementById("gender").value,
    address: document.getElementById("address").value,
  };

  fetch("/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Profile updated successfully") {
        document.getElementById("message").innerText =
          "Profile updated successfully!";
        loadProfile(); // Reload updated data
        cancelEdit();
      } else {
        document.getElementById("message").innerText =
          "Error updating profile.";
      }
    })
    .catch((error) => console.error("Error saving profile:", error));
}
