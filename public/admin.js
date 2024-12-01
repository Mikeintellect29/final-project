document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#admin-login-form");
  const registerForm = document.querySelector("#admin-register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;

      const response = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      document.querySelector("#login-message").textContent = data.message;

      if (response.ok) {
        window.location.href = "/admin/dashboard";
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      const role = document.querySelector("#role").value;

      const response = await fetch("/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();
      document.querySelector("#register-message").textContent = data.message;
    });
  }
});
