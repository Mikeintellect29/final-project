//Get the form element by id
let submit = document.getElementById("registrationForm");

// Add event listerner that runs when the form is submitted
submit.addEventListener("submit", async (event) => {
  event.preventDefault();
  // validate form
  let valid = true;

  //clear any previous error messages
  document.getElementById("nameError").innerHTML = "";
  document.getElementById("lastError").innerHTML = "";
  document.getElementById("countryError").innerHTML = "";
  document.getElementById("emailError").innerHTML = "";
  document.getElementById("genderError").innerHTML = "";
  document.getElementById("dobError").innerHTML = "";
  document.getElementById("phoneError").innerHTML = "";
  document.getElementById("addressError").innerHTML = "";
  document.getElementById("passwordError").innerHTML = "";
  document.getElementById("confirmPasswordError").innerHTML = "";
  document.getElementById("termsError").innerHTML = "";

  // const errorIds = [
  //   "nameError",
  //   "lastError",
  //   "userError",
  //   "countryError",
  //   "emailError",
  //   "genderError",
  //   "dobError",
  //   "phoneError",
  //   "addressError",
  //   "passwordError",
  //   "confirmPasswordError",

  //   "termsError",
  //   "registerError",
  // ];
  // errorIds.forEach((id) => (document.getElementById(id).innerHTML = ""));

  //get all values from the forms in html and trim any extra spaces

  const formData = {
    first_name: document.getElementById("firstName").value.trim(),
    last_name: document.getElementById("lastName").value.trim(),
    country: document.getElementById("country").value.trim(),
    email: document.getElementById("email").value.trim(),
    gender: document.getElementById("gender").value.trim(),
    date_of_birth: document.getElementById("dob").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    password: document.getElementById("password").value.trim(),
    confirmPassword: document.getElementById("confirmPassword").value.trim(),

    terms: document.getElementById("terms").checked,
  };

  const {
    first_name,
    last_name,
    country,
    email,
    gender,
    date_of_birth,
    phone,
    address,
    password,
    confirmPassword,

    terms,
  } = formData;

  // validate check
  if (!first_name) {
    document.getElementById("nameError").innerHTML = "First Name  is required";
    valid = false;
  }

  if (!last_name) {
    document.getElementById("lastError").innerHTML = "last Name  is required";
    valid = false;
  }

  if (!country) {
    document.getElementById("countryError").innerHTML =
      "Country selection is required";
    valid = false;
  }

  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.match(emailPattern)) {
    document.getElementById("emailError").innerHTML =
      "please enter a valid email address";
    valid = false;
  }

  if (gender !== "male" && gender !== "female" && gender !== "other") {
    document.getElementById("genderError").innerHTML = "Gender is require";
    valid = false;
  }

  if (!date_of_birth) {
    document.getElementById("dobError").innerHTML = "date of birth is require";
    valid = false;
  }

  if (!phone || !/^[0-9]{10,15}$/.test(phone)) {
    document.getElementById("phoneError").innerHTML = "phone number is require";
    valid = false;
  }

  if (!address) {
    document.getElementById("addressError").innerHTML = "address is require";
    valid = false;
  }

  if (password.length < 8) {
    document.getElementById("passwordError").innerHTML =
      "password must be at least 8 characters long";
    valid = false;
  }

  if (password !== confirmPassword) {
    document.getElementById("confirmPasswordError").innerHTML =
      "password do not match.";
    valid = false;
  }

  if (!terms) {
    document.getElementById("termsError").innerHTML =
      "you must agree to the terms and conditions";
    valid = false;
  }
  //if form not valid ,do not submit
  if (!valid) return;

  // store all data into a localStorage

  try {
    const response = await fetch("http://localhost:3800/patients/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Registration successful! please Login..");
      window.location.href = "/login";
    } else {
      document.getElementById("registerError").innerText = result.message;
    }
  } catch (error) {
    document.getElementById("registerError").innerHTML =
      "error registering. Please try again.";
  }
});
