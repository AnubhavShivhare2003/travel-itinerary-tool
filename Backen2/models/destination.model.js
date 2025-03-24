const mongoose=require('mongoose');

const destinationSchema= mongoose.Schema({
    itineraryId:{type:mongoose.Schema.Types.ObjectId,ref:"Itinerary",required:true},
    name:{type:String,required:true},
    placeId:{type:String,required:true},
    country:{type:String,required:true},
    city:{type:String},
    description:{type:String}
})

const Destination=mongoose.model("Destination",destinationSchema);
module.exports=Destination;