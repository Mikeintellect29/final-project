let submit = document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    //function validateForm()
    let valid = true;

    // clear error

    document.getElementById("emailError").innerHTML = "";
    document.getElementById("passwordError").innerHTML = "";
    document.getElementById("loginError").innerText = "";

    // get form value by id

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    // write a condition statement on what to display

    if (email === "") {
      document.getElementById("emailError").innerHTML =
        "Error!! email is require";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("emailError").innerHTML =
        "Error! Please enter a valid email.";
      valid = false;
    }

    if (password === "") {
      document.getElementById("passwordError").innerHTML =
        "Error! password require ";
      valid = false;
    } else if (password.length < 8) {
      document.getElementById("passwordError").innerHTML =
        "Error! password must be atleast 8 character long";
      valid = false;
    }

    // stop fetching request if validation fails
    if (!valid) return;

    //handingly fetch

    try {
      const response = await fetch("http://localhost:3800/patients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      //handling successful login

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("jwttoken", data.token);
          window.location.href = "/dashboard";
        } else {
          document.getElementById("loginError").innerText =
            "Error! Missing authentication token";
        }
      } else {
        document.getElementById("loginError").innerText =
          data.message || "Error!  Incorrect email or password";
      }
    } catch (error) {
      document.getElementById("loginError").innerText =
        "Network  Error. Please try again";
    }
  });
