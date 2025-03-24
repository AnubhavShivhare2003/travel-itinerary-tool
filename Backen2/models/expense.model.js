const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary", required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["Transport", "Accommodation", "Food", "Activities", "Shopping", "Other"], required: true },
  date: { type: Date, default: Date.now },
  splitAmong: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amountOwed: { type: Number, required: true }
    }
  ]
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
