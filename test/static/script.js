document.addEventListener('DOMContentLoaded', function () {
    // Initialize the login button
    document.getElementById('login-button').addEventListener('click', function () {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Check for demo credentials
        const demoEmail = "demo@example.com";
        const demoPassword = "password123"; // Set your demo password here

        if (email === demoEmail && password === demoPassword) {
            document.getElementById('message').innerText = "Login successful!";
            // Redirect to a new page after a successful login
            window.location.href = "newPage.html"; // Change to your new page
        } else {
            document.getElementById('message').innerText = "Invalid email or password.";
        }
    });

    // Close the popup when the exit button is clicked
    document.querySelector('.exit-button').addEventListener('click', function () {
        window.close();
    });
});


