document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission

      let valid = true;

      // Clear previous errors
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");
      const loginError = document.getElementById("loginError");

      if (!emailError || !passwordError || !loginError) {
        console.error("One or more required elements are missing.");
        return;
      }

      emailError.innerText = "";
      passwordError.innerText = "";
      loginError.innerText = "";

      // Get form values
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Validate email
      if (!email) {
        emailError.innerText = "Error! Email is required.";
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        emailError.innerText = "Error! Please enter a valid email address.";
        valid = false;
      }

      // Validate password
      if (!password) {
        passwordError.innerText = "Error! Password is required.";
        valid = false;
      } else if (password.length < 8) {
        passwordError.innerText =
          "Error! Password must be at least 8 characters long.";
        valid = false;
      }

      // Stop fetch if validation fails
      if (!valid) return;

      // Handle fetch request
      const loginButton = document.getElementById("loginButton");
      try {
        // Show loading spinner (optional)
        if (loginButton) {
          loginButton.disabled = true;
          loginButton.innerText = "Logging in...";
        }

        const response = await fetch("http://localhost:3800/doctors/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.token) {
            localStorage.setItem("jwttoken", data.token);
            window.location.href = "/doc-dashboard"; // Redirect to dashboard
          } else {
            loginError.innerText = "Error! Missing authentication token.";
          }
        } else {
          loginError.innerText =
            data.message || "Error! Incorrect email or password.";
        }
      } catch (error) {
        loginError.innerText = "Network Error. Please try again.";
      } finally {
        // Reset button state
        if (loginButton) {
          loginButton.disabled = false;
          loginButton.innerText = "Login";
        }
      }
    });
});
