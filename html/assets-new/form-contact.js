// Define validation conditions
const isNotEmpty = (value) => value.trim() !== "";
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Helper function to validate and display error for each form field
function validateField(fieldId, errorId, validator, errorMessage) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(errorId);

  if (!field || !errorElement) {
    console.warn(`Field or error element not found: ${fieldId}, ${errorId}`);
    return false;
  }

  field.addEventListener("input", () => {
    errorElement.textContent = validator(field.value) ? "" : errorMessage;
  });

  if (!validator(field.value)) {
    errorElement.textContent = errorMessage;
    return false;
  }
  errorElement.textContent = "";
  return true;
}

function trackPageVisit() {
  const pageVisited = window.location.href;
  const pagesVisited = JSON.parse(localStorage.getItem("pagesVisited")) || [];
  pagesVisited.push(pageVisited);
  localStorage.setItem("pagesVisited", JSON.stringify(pagesVisited));
}

window.onload = trackPageVisit;

function handleFormSubmit(formId, nameId, emailId, descriptionId, enquiry_typeId, responseMessageId) {
  const form = document.getElementById(formId);

  if (!form) {
    console.warn(`Form with ID "${formId}" not found`);
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isNameValid = validateField(nameId, `${nameId}Error`, isNotEmpty, "Name is required.");
    const isEmailValid = validateField(emailId, `${emailId}Error`, isValidEmail, "Email address is required.");
    const isDescriptionValid = validateField(descriptionId, `${descriptionId}Error`, isNotEmpty, "Message is required.");
    const isEnquiryTypeValid = validateField(enquiry_typeId, `${enquiry_typeId}Error`, isNotEmpty, "Enquiry Type is required.");

    if (!isNameValid || !isEmailValid || !isDescriptionValid || !isEnquiryTypeValid) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.source = localStorage.getItem("userReferrer") || "direct";
    data.page_visited = localStorage.getItem("lastPageVisited") || window.location.href;
    data.pages_visited = JSON.parse(localStorage.getItem("pagesVisited")) || [];

    const responseMessage = document.getElementById(responseMessageId);
    if (!responseMessage) {
      console.warn(`Response message element with ID "${responseMessageId}" not found`);
      return;
    }

    try {
      const response = await fetch("https://crmapi.sparkouttech.com/api/v1/leads/onboard-lead/6732f9cd103649bd1933b0d7/673305983e1e13749fc044e9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        responseMessage.textContent = `Success! Message: ${result.message}`;
        form.reset();
        localStorage.removeItem("userReferrer");
        localStorage.removeItem("lastPageVisited");
        localStorage.removeItem("pagesVisited");

        // Redirect to the "Thank You" page after success
        setTimeout(() => {
          window.location.href = "/thank-you";
        }, 2000);
      } else {
        const errorData = await response.json();
        responseMessage.textContent = `Error: ${errorData.message}`;
      }
    } catch (error) {
      responseMessage.textContent = `Network Error: ${error.message}`;
    }
  });
}

// Initialize handlers for both forms
handleFormSubmit("quickcontactForm", "name1", "email1", "description1", "enquiry_type1", "responseMessage1");
handleFormSubmit("quickcontactForm1", "name5", "email5", "description5", "enquiry_type5", "responseMessage5");
handleFormSubmit("quickcontactForm2", "name6", "email6", "description6", "enquiry_type6", "responseMessage6");
handleFormSubmit("quickcontactForm3", "name7", "email7", "description7", "enquiry_type7", "responseMessage7");
