const mongoose=require('mongoose');
const Itinerary = require('./itinerary.model');

const notiificationSchema=mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    itinerary:{type:mongoose.Schema.Types.ObjectId,ref:"Itinerary",required:false},
    type:{type:String,enum:["reminder","update","expense_alert","new_activity"],required:true},
    message:{type:String,required:true},
    isRead:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now}
});

const Notification=mongoose.model("Notification",notificationSchema);
module.exports=Notification;