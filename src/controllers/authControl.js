// FSJS2.0 9th feb-mega project

import asyncHandler from "../service/asyncHandler.js";
import User from "../modules/userSchema.js";
import CustomError from "../utils/CustomError.js";
import mailHelper from "../utils/mailHelper.js";

export const cookieOptions={
    expires : new Date(Date.now()+ 3* 24 * 60 * 60 * 1000),
    httpOnly: true
}


// Controller for sign-up/registration

export const signUp= asyncHandler(async (req,res)=>{

    //collect user details
    const {name, email, password}=req.body;

    // verify recived values
    if (!name || !email || !password){
        throw new CustomError("Please enter All required fields", 400);
    }

    // Check if user already exist's
    const userExistance=User.findOne({email})
    if (userExistance){
        throw new CustomError("User Already exists", 500)
    }
    // created new entry in DATABASE && db will return all entrys after completion
    const user = await User.create({
        name,
        email,
        password
    });

    user.password=undefined;
    //generate JWT token 

    const token = user.getJwtToken();

    res.cookie("token",token, cookieOptions)

    // Sending Back Responce to user, with selected fields only
    res.status(200).json({
        success :true,
        token,
        name
    })
})

// Controller for Login user

export const logIn= asyncHandler(async (req, res)=>{
    // colect credentials 
    const {email, password }= req.body;
    
    // validation
    if (!email || !password){
        throw new CustomError("Please enter Credentials",403);
    }
    
    // Checking if email Matches
    const user =await User.findOne({email}).select("+password")
    
    if (!user.email){
        throw new CustomError("User not found, please signUp!! ", 400)
    }
    
    const passMatches=await user.comparePassword(password)
    if (passMatches){
        const token =await user.getJwtToken();
        user.password=undefined

        // Sending Back Responce to user, with selected fields only
        res.cookie("token",token, cookieOptions)

        return res.status(200).json({
            success :true,
            token,
            user
        })
    }
    throw new CustomError("Password is Incorrect", 400);
} )


// Logout user
export const logout=asyncHandler(async (req, res,)=>{
    res.cookie("token",null ,{
        expires : new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success:true,
        message: "Log Out Sucessful"
    })
})

// getProfile controller will/should be exicuted after "isLogedIn" middleware

export const getProfile=asyncHandler(async (req,res)=>{
    // user is a field added in isLoggedIn middleware
    const {user}=req
    
    if(!user){
        throw new CustomError("User doesn't exist's",404)
    }
    res.status(200).json({
        success: true,
        user
    })
})


export const deleteUser= asyncHandler(async (req, res)=>{
    // colect credentials 
    const {email, password }= req.body;
    
    // validation
    if (!email || !password){
        throw new CustomError("Please enter Credentials");
    }
    
    // Checking if email Matches
    const user =await User.findOne({email}).select("+password")
    
    if (!user?.email){
        throw new CustomError("User not found", 404)
    }
    
    const passMatches=await user.comparePassword(password)
    if (!passMatches){
        throw new CustomError("Invalid credentials, request denied", 403);

    }
    
    const deleted =await User.findOneAndDelete({email})
    if (!deleted){
        throw new CustomError("Unable to delete user account, try again")
    }
    return res.status(200).json({
        success :true,
        message: "User account deleted succesfully"
    })
} )

// User request for forgot password, token is granted through mail
export const forgotPassword=asyncHandler(async (req, res)=>{
    const {email }=req.body;

    // validation
    if (!email){
        throw new CustomError("Email is required",403);
    }

    const user =await User.findOne({email})
    if (!user){
        throw new CustomError("User doesn't exist with this email", 404)
    }

    const frogotToken= await user.generateForgotPasswordToken();
    await user.save({validateBeforeSave:false})
    const resetUrl= `${req.protocol}://${req.get('host')}/api/auth/forgotpassword/${frogotToken}`
    let options={
        to : email,
        subject: "Reset Password eCommerce",
        text: `
            Hello ${user.name},

            Request for reset password has been recived againest the email : ${email}.

            reset Link : ${resetUrl}

            If it's not requested by you. 
            contact our support...
        `
    }

    try{
        await mailHelper(options);
    }
    catch (error)
    {   
        user.ForgetPasswordToken=undefined;
        user.forgotPasswordExpiry=undefined;
        await user.save({validateBeforeSave:false})

        res.status(200).json({
            success :true,
            message :"Email has been sent with reset password link"
        })
    }
})


// User requests resetPassword with reset pass link sent through mail 
export const resetPassword =asyncHandler(async (req, res)=>{
    const {token : resetToken}=req.params;
    const {password , confirmPassword}=req.body;

    if (!resetPassword || !password || !confirmPassword){
        throw new CustomError("Enter all required fields",403)
    };

    const user= await User.find({
            ForgetPasswordToken: resetToken,
            forgotPasswordExpiry: {$gt : Date.now()}
    })

    if (!user){
        throw new CustomError("Reset Link is invalid or Expired",404);
    }
    
    user.password=password;
    user.ForgetPasswordToken=undefined;
    user.forgotPasswordExpiry=undefined;
    await user.save()

    const token =await user.getJwtToken()

    res.cookie("token",token, cookieOptions);

    res.status(200).json({
        sucess:true,
        message: "Succesfully password reseted",
        user
    })
})