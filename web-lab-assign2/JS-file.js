let submit = document.getElementById("submit");
submit.addEventListener("click", function(e) {
    if (!validation()) {
        e.preventDefault();  // Prevent form submission if validation fails
    }
});

let inputs = document.querySelectorAll(".form-control");

function validation() {
    let isValid = true; // Initial state is valid

    // Loop through each input field
    for (let i = 0; i < inputs.length; i++) {
        let existingError = inputs[i].nextElementSibling;  // Check for existing error message
        if (existingError) {
            existingError.remove();  // Remove existing error message if present
           
        }

        // Check if the input field is empty
        if (!inputs[i].value.trim()) {
            isValid = false;  // Set form as invalid

            // Create error message
            let error = document.createElement("p");
            error.textContent = "This field is required";
            error.classList.add("error");
            inputs[i].after(error);  // Insert error message after the input field
        }
    }
    
    return isValid;  // Return true if all fields are valid, false otherwise
}

