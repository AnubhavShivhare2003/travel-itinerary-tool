const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:["user","admin"],default:'user'},
    },
    {timestamps:true}
);


//Hashing password before saving to database.
userSchema.pre("save",async function(next){
    //if the password is not modified then no need to hash again.
    if(!this.isModified("password")){
        return next();
    }

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next()
})


//compare entered password with stored hashed password
userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

const User=mongoose.model("User",userSchema);
module.exports=User;