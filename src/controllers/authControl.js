// FSJS2.0 9th feb-mega project

import asyncHandler from "../service/asyncHandler";
import User from "../modules/userSchema.js";
import CustomError from "../utils/CustomError";

// Controller for sign-up/registration

const signUp= asyncHandler(async (req,res)=>{

    //collect user details
    const {name, email, password}=req.body;

    // verify recived values
    if (!name || !email || !password){
        throw new CustomError("Please enter All required fields", 400);
    }

    // Check if user already exist's
    const userExistance=User.findOne({email})
    if (userExistance) throw new CustomError("User Already exists", 500)

    // created new entry in DATABASE && db will return all entrys after completion
    const user = User.create({
        name,
        email,
        password
    });
    user.password=undefined;
    //generate JWT token 

    const token = user.getJwtToken();

    // Sending Back Responce to user, with selected fields only
    res.status(200).json({
        success :true,
        token,
        name
    })
})


export default signUp