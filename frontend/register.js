document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });
    
        const data = await response.json();

        if (response.ok) {
            alert("Registration successful! Redirecting to login...");
            window.location.href = "login.html";
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert("Registration failed. Please try again.");
        console.error("Registration Error:", error);
    }
});
