const mongoose=require("mongoose");
const Itinerary = require("./itinerary.model");

const bookingSchema=mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    itineraryId:{type:mongoose.Schema.Types.ObjectId,ref:"Itinerary",required:true},
    type:{type:String,enum:["flight","hotel","transport","activity"],required:true},
    details:{airline:String,hotelName:String,transportType:String,activityName:String,bookingReferene:String},
    startDate:{type:Date},
    endDate:{type:Date},
    price:{type:Number,required:true},
    status:{type:String,enum:["confirmed","pending","cancelled"],default:"pending"},
    },
    {timestamps:true}
)

const Booking=mongoose.model("Booking",bookingSchema);
module.exports=Booking;