import Product from "../modules/productSchema.js";
import formidable from "formidable";
import asyncHandler from "../service/asyncHandler";
import { s3FIleUpload, s3DeleteFile } from "../service/imageUploader.js";
import { Mongoose } from "mongoose";
import CustomError from "../utils/CustomError.js";


export const addProduct =asyncHandler(async (req,res)=>{
    const form = formidable({ multiples: true,keepExtensions:true });

    form.parse(req, (err, fields, files) => {
        if(err){
            throw new CustomError("Oops.. Something went wrong",500)
        }
        let productId= new Mongoose.Types.ObjectID().toHexString();

        console.log(fields, files);

    })
})