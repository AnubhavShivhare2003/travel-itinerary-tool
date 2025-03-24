const express = require("express");
const router = express.Router();
const Activity = require("../models/activity.model");
const Itinerary = require("../models/itinerary.model");
const authenticateToken = require("../middlewares/authenticateToken");

// ===============================
// ✅ CREATE AN ACTIVITY
// ===============================
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { itineraryId, title, date, time, location } = req.body;
        const userId = req.user.id;

        if (!itineraryId || !title || !date || !time || !location) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if itinerary exists before adding activity
        const itineraryExists = await Itinerary.findById(itineraryId);
        if (!itineraryExists) {
            return res.status(404).json({ error: "Itinerary not found." });
        }

        const newActivity = new Activity({
            itineraryId,
            userId,
            title,
            date,
            time,
            location
        });

        const savedActivity = await newActivity.save();
        res.status(201).json(savedActivity);
    } catch (error) {
        console.error("Error adding activity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ===============================
// ✅ GET ACTIVITIES BY ITINERARY
// ===============================
router.get("/itinerary/:itineraryId", authenticateToken, async (req, res) => {
    try {
        const { itineraryId } = req.params;

        // Ensure the itinerary exists
        const itineraryExists = await Itinerary.findById(itineraryId);
        if (!itineraryExists) {
            return res.status(404).json({ error: "Itinerary not found." });
        }

        const activities = await Activity.find({ itineraryId });
        res.json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }
        res.json({ message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
module.exports = router;
