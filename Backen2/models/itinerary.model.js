const mongoose = require("mongoose");

const itinerarySchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Fixed

    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    destinations: [
      {
        name: { type: String, required: true },
        location: {
          type: { type: String, default: "Point" }, // ✅ GeoJSON format
          coordinates: { type: [Number], required: true } // [longitude, latitude]
        },
        visitedDate: { type: Date },
        notes: { type: String }
      }
    ],

    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity", default: [] }], // ✅ Default empty array
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense", default: [] }],   // ✅ Default empty array
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = Itinerary;
