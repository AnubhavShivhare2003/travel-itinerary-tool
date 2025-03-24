document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("token", data.token); // Store JWT token
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            alert(data.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});
