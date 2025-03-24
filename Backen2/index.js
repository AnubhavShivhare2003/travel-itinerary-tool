const express=require('express');
const cors=require('cors');
require('dotenv').config();
const connectDb=require("./config/db")
const itineraryRoutes = require("./routes/itinerary.route");
const userRoutes=require("./routes/user.routes")
const activityRoutes=require("./routes/activity.routes")
const Expense=require("./routes/expense.routes")
const app=express();
app.use(express.json());
app.use(cors())
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/auth",userRoutes)
app.use("/api/activities", activityRoutes);
app.use("/api/Expenses",Expense)
const PORT=process.env.PORT
app.listen(PORT,()=>{
    connectDb()
    console.log(`Server is running on PORT:${PORT}`)
})