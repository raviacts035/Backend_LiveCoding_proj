import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken";
import { config } from "dotenv";
import crypto from "crypto"


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
    ForgetPasswordToken:String,
    forgotPasswordExpiry:String
},{timestamps:true}
)

//Hooks, Encrypting password just before save 
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods={

    // Compare Passwords maybe for login
    comparePassword: async function (providedPassword){
        return bcrypt.compare(providedPassword,this.password)
    },

    //generate JWT token
    getJwtToken : async function (){
        const token= JWT.sign({_id: this._id },config.JWT_SECRET,{ expiresIn:config.JWT_EXPIRY})
    },

    // generate Forgot Password Token
    generateForgotPasswordToken: function (){
        const forgotToken = crypto.randomBytes(20).toString('hex');
        this.ForgetPasswordToken=crypto
        .createHash("sha256")
        .update(forgotToken)
        .digest("hex")

        //Token expires in
        this.forgotPasswordExpiry=Date.now() + 20 * 60 * 1000
        
        return forgotToken
    }
}

// check if email exists in DB
//  Create a "forgotPasswordToken" 
// store it in DB
// Send it to user in your method (mail)

// ( User HIT the forgot Password ROught )
// Check if the token exists in DB
// Check Expiry Time of "forgotPasswordToken"



export default mongoose.model("User",userSchema)