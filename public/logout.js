// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");

  // Add event listener to the login button
  loginBtn.addEventListener("click", function () {
    // Redirect the user to the login page
    window.location.href = "/login"; // Adjust this URL based on your login route
  });
});
