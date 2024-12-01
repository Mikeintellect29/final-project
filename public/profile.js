document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.getElementById("editProfileBtn");
  const editForm = document.getElementById("editProfileForm");
  const cancelEditButton = document.getElementById("cancelEdit");
  const updateForm = document.getElementById("updateProfileForm");

  // Show edit form when 'Edit Profile' button is clicked
  editButton.addEventListener("click", () => {
    editForm.style.display = "block";
  });

  // Hide edit form when 'Cancel' is clicked
  cancelEditButton.addEventListener("click", () => {
    editForm.style.display = "none";
  });

  // Handle profile update form submission
  updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(updateForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch("/patients/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
        window.location.reload();
      } else {
        alert(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  });
});
