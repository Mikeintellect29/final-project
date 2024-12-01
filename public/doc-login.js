document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    let valid = true;

    // Clear previous errors
    document.getElementById("emailError").innerText = "";
    document.getElementById("passwordError").innerText = "";
    document.getElementById("loginError").innerText = "";

    // Get form values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate email
    if (!email) {
      document.getElementById("emailError").innerText =
        "Error! Email is required.";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("emailError").innerText =
        "Error! Please enter a valid email address.";
      valid = false;
    }

    // Validate password
    if (!password) {
      document.getElementById("passwordError").innerText =
        "Error! Password is required.";
      valid = false;
    } else if (password.length < 8) {
      document.getElementById("passwordError").innerText =
        "Error! Password must be at least 8 characters long.";
      valid = false;
    }

    // Stop fetch if validation fails
    if (!valid) return;

    // Handle fetch request
    try {
      // Show loading spinner (optional)
      const loginButton = document.getElementById("loginButton");
      loginButton.disabled = true;
      loginButton.innerText = "Logging in...";

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
          document.getElementById("loginError").innerText =
            "Error! Missing authentication token.";
        }
      } else {
        document.getElementById("loginError").innerText =
          data.message || "Error! Incorrect email or password.";
      }
    } catch (error) {
      document.getElementById("loginError").innerText =
        "Network Error. Please try again.";
    } finally {
      // Reset button state
      loginButton.disabled = false;
      loginButton.innerText = "Login";
    }
  });
