const express = require("express");
const router = express.Router();
const Expense = require("../models/expense.model"); // ✅ Ensure this is correct

router.get("/", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        console.error("🔥 Error fetching expenses:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
