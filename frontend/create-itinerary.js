document.addEventListener("DOMContentLoaded", () => {
    const itineraryForm = document.getElementById("new-itinerary-form");
    const itinerariesList = document.getElementById("itineraries");
    const dashboardBtn = document.getElementById("dashboard-btn");
    const logoutBtn = document.getElementById("logout-btn");

    const API_URL = "http://localhost:5000/api";

    // Redirect to Dashboard
    if (dashboardBtn) {
        dashboardBtn.addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
    }

    // Logout Functionality
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });
    }

    // Function to Fetch Itineraries
    async function fetchItineraries() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You need to log in first!");
                setTimeout(() => window.location.href = "login.html", 1000);
                return;
            }

            const response = await fetch(`${API_URL}/itineraries`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to fetch itineraries");

            const itineraries = await response.json();
            displayItineraries(itineraries);
        } catch (error) {
            console.error("Error fetching itineraries:", error);
            itinerariesList.innerHTML = `<p style="color: red;">Failed to load itineraries.</p>`;
        }
    }

    // Function to Display Itineraries
    function displayItineraries(itineraries) {
        itinerariesList.innerHTML = "";
        if (!itineraries || itineraries.length === 0) {
            itinerariesList.innerHTML = "<p>No itineraries found. Create one!</p>";
            return;
        }

        itineraries.forEach(itinerary => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${itinerary.title}</strong> 
                <p>${new Date(itinerary.startDate).toDateString()} - ${new Date(itinerary.endDate).toDateString()}</p>
                <button onclick="window.location.href='itinerary-details.html?id=${itinerary._id}'">View & Manage</button>
            `;
            itinerariesList.appendChild(li);
        });
    }

    // Function to Create a New Itinerary
    itineraryForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please log in first!");
            return;
        }

        const itineraryData = { title, startDate, endDate };

        try {
            const response = await fetch(`${API_URL}/itineraries`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itineraryData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to create itinerary");
            }

            alert("Itinerary added successfully!");
            itineraryForm.reset();
            
            // Redirect to itinerary details page
            window.location.href = `itinerary-details.html?id=${responseData._id}`;
        } catch (error) {
            console.error("Error creating itinerary:", error);
            alert(error.message || "Failed to create itinerary.");
        }
    });

    // Fetch Itineraries on Page Load
    fetchItineraries();
});
