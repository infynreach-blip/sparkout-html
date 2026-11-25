// Define validation conditions
const isNotEmptyField = (value) => value.trim() !== "";
const isValidEmailField = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Helper function to validate and display error for each form field
function validateField(fieldId, errorId, validator, errorMessage) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(errorId);

  // Set up real-time error handling on input
  field.addEventListener("input", () => {
      if (validator(field.value)) {
          errorElement.textContent = ""; // Clear error when valid input is provided
      } else {
          errorElement.textContent = errorMessage;
      }
  });

  // Display error message when field is focused
  field.addEventListener("focus", () => {
      if (!validator(field.value)) {
          errorElement.textContent = errorMessage;
      }
  });

  if (!validator(field.value) && errorElement) {
      errorElement.textContent = errorMessage;
      return false;
  }
  errorElement.textContent = "";
  return true;
}


function trackPageVisit() {
  const pageVisited = window.location.href;

  // Get the existing pages array from localStorage, or initialize an empty array
  const pagesVisited = JSON.parse(localStorage.getItem("pagesVisited")) || [];

  // Add the current page to the array
  pagesVisited.push(pageVisited);

  // Save the updated array back to localStorage
  localStorage.setItem("pagesVisited", JSON.stringify(pagesVisited));
}

// Track page visit on each page load
window.onload = trackPageVisit;


// Function to handle form validation and submission
function handleFormSubmit(formId, nameId, emailId, descriptionId, responseMessageId) {
    const form = document.getElementById(formId);

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Validate fields
        const isNameValid = validateField(nameId, `${nameId}Error`, isNotEmptyField, "Name is required.");
        const isEmailValid = validateField(emailId, `${emailId}Error`, isValidEmailField, "Please enter a valid email address.");
        const isDescriptionValid = validateField(descriptionId, `${descriptionId}Error`, isNotEmptyField, "Project is required.");

        // Stop submission if any field is invalid
        if (!isNameValid || !isEmailValid || !isDescriptionValid) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Retrieve data from localStorage
        data.source = localStorage.getItem("userReferrer") || "direct";
        data.page_visited = localStorage.getItem("lastPageVisited") || window.location.href;

        // Retrieve all pages visited
        data.pages_visited = JSON.parse(localStorage.getItem("pagesVisited")) || [];

        console.log("Data: ", data)
        try {
            const response = await fetch("https://crmapi.sparkouttech.com/api/v1/leads/onboard-lead/6732f9cd103649bd1933b0d7/673309a83e1e13749fc0450c", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const responseMessage = document.getElementById(responseMessageId);
            if (response.ok) {
                const result = await response.json();

                responseMessage.textContent = `Success! Message: ${result.message}`;
                form.reset();
                // Optionally, clear tracking data on successful form submission
                localStorage.removeItem("userReferrer");
                localStorage.removeItem("lastPageVisited");
                localStorage.removeItem("pagesVisited");

                // Redirect to the "Thank You" page after success
                setTimeout(() => {
                  window.location.href = "/thank-you"; // Replace with your actual "Thank You" page URL
                }, 2000); // Redirect after 2 seconds

            } else {
                const errorData = await response.json();
                responseMessage.textContent = `Error: ${errorData.message}`;
            }
        } catch (error) {
            responseMessage.textContent = `Network Error: ${error.message}`;
        }
    });
}

// Initialize validation and submission handling for each form
handleFormSubmit("userForm1", "name4", "email4", "description4", "responseMessage4");
handleFormSubmit("userForm2", "name2", "email2", "description2", "responseMessage2");
handleFormSubmit("userForm3", "name3", "email3", "description3", "responseMessage3");

// Function to store referrer data in localStorage
// function storeReferrerData() {
//   const referrer = document.referrer || "direct";
//   localStorage.setItem("userReferrer", referrer);
// }

// Store referrer data on page load
// window.onload = function() {
//   storeReferrerData();
// };

