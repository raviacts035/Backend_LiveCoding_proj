import User from "../modules/userSchema.js";
import config from "../config/index.js";
import JWT from "jsonwebtoken";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";

export const isLogedIn = asyncHandler(async (req,res,next)=>{
    // collecting token from request Body or header (in case of Mobile Users)
    if ( req.cookie?.token || req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        var token=(req?.cookie?.token || req.headers?.authorization.split(" ")[1]);
    }

    if (!token ){
        throw new CustomError("Not Authorized to access this Resource",403)
    }

    // Verifing colleted token and setting User data into req.user
    try{
        const decodedToken= JWT.verify(token,config.JWT_SECRET);
        req.user = await User.findById(decodedToken._id, "name email");
    }
    catch (error){
        throw new CustomError("Not Authorized to access this Resource",403)
    }
    // This next() is necessary and it rises a flag to exicute next middleware in list
    next();
})


// Authorized Middlewhere, will check role

export const authorized = (...givenRoles)=> asyncHandler((req,res,next)=>{
    if (!req.user.role){
        throw new CustomError("You are not authorized to access this resource",200)
    }
    next()
})