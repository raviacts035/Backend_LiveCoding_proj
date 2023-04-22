import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js"
import bcrypt from "bcryptjs"

const userSchema= new mongoose.Schema(
{
    name:{
        type:String,
        required:[true,"Name is required"],
        maxLength:[50,"Name must be less then 50 Chars"],
    },
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:[8,"Password should be minimus 8 char"],
        select:false
    },
    ForgetPassword:String,
    ResetPassword:token
},{timestamps:true}
)

//Hooks, Encrypting password just before save 
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password, 10)
    next()
})



export default mongoose.model("User",userSchema)