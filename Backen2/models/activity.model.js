const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    itineraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary", // Reference to Itinerary model
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Activity", ActivitySchema);
