document.addEventListener("DOMContentLoaded", async () => {
    const itineraryTitle = document.getElementById("itinerary-title");
    const itineraryDates = document.getElementById("itinerary-dates");
    const activityList = document.getElementById("activity-list");
    const backBtn = document.getElementById("back-btn");
    const addActivityForm = document.getElementById("add-activity-form");

    const API_URL = "http://localhost:5000/api";
    const token = localStorage.getItem("token");
    const itineraryId = localStorage.getItem("selectedItineraryId");

    if (!itineraryId || !token) {
        alert("Itinerary not found. Redirecting to dashboard.");
        window.location.href = "dashboard.html";
        return;
    }

    console.log("Selected Itinerary ID:", itineraryId);

    // Fetch Itinerary Details
    try {
        const response = await fetch(`${API_URL}/itineraries/${itineraryId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Failed to fetch itinerary details");

        const itinerary = await response.json();
        itineraryTitle.textContent = itinerary.title;
        itineraryDates.textContent = `${new Date(itinerary.startDate).toDateString()} - ${new Date(itinerary.endDate).toDateString()}`;

        // Fetch and Display Activities
        fetchActivities();
    } catch (error) {
        console.error("Error fetching itinerary details:", error);
        alert("Failed to load itinerary.");
        window.location.href = "dashboard.html";
    }

    // Fetch Activities for the Selected Itinerary
    async function fetchActivities() {
        console.log("Fetching activities for Itinerary ID:", itineraryId);

        try {
            const response = await fetch(`${API_URL}/activities/itinerary/${itineraryId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to fetch activities");

            const activities = await response.json();
            console.log("Activities Fetched:", activities);
            displayActivities(activities);
        } catch (error) {
            console.error("Error fetching activities:", error);
            activityList.innerHTML = `<p style="color: red;">Failed to load activities.</p>`;
        }
    }

    // Display Activities with Delete Button
    function displayActivities(activities) {
        activityList.innerHTML = "";
        if (!activities || activities.length === 0) {
            activityList.innerHTML = "<p>No activities added yet.</p>";
            return;
        }

        activities.forEach(activity => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${activity.title}</strong> 
                <p>${new Date(activity.date).toDateString()} at ${activity.time}</p>
                <p>📍 ${activity.location}</p>
                <button class="delete-btn" data-id="${activity._id}">❌ Delete</button>
            `;

            activityList.appendChild(li);
        });

        // Add Event Listeners to Delete Buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const activityId = event.target.dataset.id;
                await deleteActivity(activityId);
            });
        });
    }

    // Function to Delete an Activity
    async function deleteActivity(activityId) {
        if (!confirm("Are you sure you want to delete this activity?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/activities/${activityId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to delete activity");

            alert("Activity deleted successfully!");
            fetchActivities(); // Refresh the activity list
        } catch (error) {
            console.error("Error deleting activity:", error);
            alert("Failed to delete activity.");
        }
    }

    // Handle Adding Activities
    addActivityForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("activity-title").value.trim();
        const date = document.getElementById("activity-date").value;
        const time = document.getElementById("activity-time").value;
        const location = document.getElementById("activity-location").value.trim();

        if (!title || !date || !time || !location) {
            alert("All fields are required.");
            return;
        }

        console.log("Adding activity:", { itineraryId, title, date, time, location });

        try {
            const response = await fetch(`${API_URL}/activities`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itineraryId,
                    title,
                    date,
                    time,
                    location
                })
            });

            if (!response.ok) throw new Error("Failed to add activity");

            alert("Activity added successfully!");
            addActivityForm.reset();
            fetchActivities();  // Refresh activity list after adding
        } catch (error) {
            console.error("Error adding activity:", error);
            alert("Failed to add activity.");
        }
    });

    // Back to Dashboard
    backBtn.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });

});
