// Ensure that the script is run after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize PropelAuth client
    const authClient = PropelAuth.createClient({
        authUrl: "https://58533292455.propelauthtest.com", // Replace with your actual auth URL
        enableBackgroundTokenRefresh: true,
    });

    // Demo user credentials
    const demoEmail = "demo@example.com"; // Replace with your demo email
    const demoPassword = "password123"; // Replace with your demo password

    // Handle login logic
    document.getElementById('login-button').addEventListener('click', async function () {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await authClient.login(email, password);
            document.getElementById('message').innerText = "Login successful!";

            // Optionally, handle successful login (e.g., redirect)
            if (response) {
                window.location.href = "newPage.html"; // Redirect after login
            }
        } catch (error) {
            // Check for demo credentials
            if (email === demoEmail && password === demoPassword) {
                document.getElementById('message').innerText = "Demo login successful!";
            } else {
                document.getElementById('message').innerText = "Login failed: " + error.message;
            }
        }
    });
});
