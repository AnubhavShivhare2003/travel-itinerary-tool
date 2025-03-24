document.addEventListener("DOMContentLoaded", () => {
    const itinerariesList = document.getElementById("itineraries");
    const logoutBtn = document.getElementById("logout-btn");
    const createItineraryBtn = document.getElementById("create-itinerary-btn");

    const API_URL = "http://localhost:5000/api";
    const token = localStorage.getItem("token");

    // Function to fetch user's itineraries
    async function fetchItineraries() {
        try {
            if (!token) {
                alert("You need to log in first!");
                window.location.href = "login.html";
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

    // Function to display itineraries in the list
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
                <button class="view-btn" data-id="${itinerary._id}">View & Manage</button>
            `;
            itinerariesList.appendChild(li);
        });
    }

    // Event delegation for dynamically added buttons
    itinerariesList.addEventListener("click", (event) => {
        if (event.target.classList.contains("view-btn")) {
            const itineraryId = event.target.getAttribute("data-id");
            localStorage.setItem("selectedItineraryId", itineraryId);
            window.location.href = "itinerary-details.html";
        }
    });

    // Logout function
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });
    }

    // Redirect to create itinerary page
    if (createItineraryBtn) {
        createItineraryBtn.addEventListener("click", () => {
            window.location.href = "create-itinerary.html";
        });
    }

    // Fetch itineraries when the page loads
    fetchItineraries();
});
