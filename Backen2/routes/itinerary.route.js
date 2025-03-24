const express = require("express");
const router = express.Router();
const Itinerary = require("../models/itinerary.model");
const Activity = require("../models/activity.model");
const { protect, authorize } = require("../middlewares/authMiddlewares");
const authenticateToken = require("../middlewares/authenticateToken");

// ===============================
// ✅ CREATE AN ITINERARY
// ===============================
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { title, startDate, endDate } = req.body;
        const userId = req.user.id; // Get logged-in user ID

        if (!title || !startDate || !endDate) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newItinerary = new Itinerary({
            userId,
            title,
            startDate,
            endDate
        });

        const savedItinerary = await newItinerary.save();
        res.status(201).json(savedItinerary);
    } catch (error) {
        console.error("Error creating itinerary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ===============================
// ✅ GET ALL ITINERARIES (User gets own, Admin gets all)
// ===============================
router.get("/", protect, async (req, res) => {
    try {
        let query = req.user.role === "admin" ? {} : { userId: req.user._id };
        let itineraries = await Itinerary.find(query);
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ===============================
// ✅ GET A SINGLE ITINERARY BY ID
// ===============================
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }
        res.status(200).json(itinerary);
    } catch (error) {
        console.error("Error fetching itinerary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ===============================
// ✅ UPDATE AN ITINERARY
// ===============================
router.put("/:id", protect, async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        if (req.user.role !== "admin" && itinerary.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedItinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedItinerary);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ===============================
// ✅ DELETE AN ITINERARY
// ===============================
router.delete("/:id", protect, async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        if (req.user.role !== "admin" && itinerary.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await itinerary.remove();
        res.status(200).json({ message: "Itinerary deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
