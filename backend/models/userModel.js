const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt = require("bcryptjs");


const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please enter a name"],
    },
    email:{
        type:String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already exists"],
    },
   
    bio:{
        type:String
    },

    password:{
        type:String,
        required: [true, "Please enter a password"],
        select: false,
    },
    posts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blog",
        },
      ]
,
    followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

    resetPassToken: String,
    resetPassExpire: Date,
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")){
      this.password=await bcrypt.hash(this.password,10)
    }
    next()
})


userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},"alphabetagammatheta",
        {expiresIn:"5d"})
}
userSchema.methods.comparePassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports=mongoose.model("User",userSchema)