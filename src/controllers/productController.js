import Product from "../modules/productSchema.js";
import formidable from "formidable";
import asyncHandler from "../service/asyncHandler";
import { s3FIleUpload, s3DeleteFile } from "../service/imageUploader.js";
import { Mongoose } from "mongoose";
import CustomError from "../utils/CustomError.js";
import fs from "fs";
import { config } from "dotenv";


export const addProduct =asyncHandler(async (req,res)=>{
    const form = formidable({ multiples: true,keepExtensions:true });

    form.parse(req, async (err, fields, files) => {
        if(err){
            throw new CustomError("Oops.. Something went wrong",500)
        }
        let productId= new Mongoose.Types.ObjectID().toHexString();

        console.log(fields, files);

        if(!fields.name || !fields.price || !fields.discription ){
                throw new CustomError("Enter all required fields", 500)
        }
        
        // uploading recived files from front-end to AWS bucket
        // AWS uploads will return array of secureUrls of files 
        let imageArrayResponce=Promise.all(
            Object.keys(files).map(async (file, index)=>{
                let element=file[fileKey]
                let data=fs.readFileSync(element.filepath)
                const upload =await s3FIleUpload({
                    bucketName:config.s3_BUCKET_NAME,
                    key: `product/${productId}/image_${index+1}.png`,
                    body: data,
                    contentType: element.mimetype
                })
                
                return {
                    secure_url: upload.Location
                }
            })
        )
        
        let imageArray=await imageArrayResponce

        // creating entry into DATABASE for new product
        const product =Product.create({
            _id: productId,
            name: fields.name,
            price:fields.price,
            discription: fields.discription,
            photos: imageArray
        })

        if (!product){
            throw new CustomError("Unable to create new product entry in DB", 500);
        }

        res.status(200).json({
            success:true ,
            product
        })
    })
})

// getProducts 
export const getProducts =asyncHandler(async (req,res)=>{
    const products =Product.find({});

    if(!products){
        throw new CustomError("No products avilable", 404)
    }

    res.status(200).json({
        success:true,
        products
    })
})

// finding product by ID in request url/parameter 
export const getProductById =asyncHandler(async (req,res)=>{
    let {id:productId} =req.params;
    if(!productId){
        throw new CustomError("Product Id is required", 500)
    }

    const products =Product.findById(productId);

    if(!products){
        throw new CustomError("No products avilable", 404)
    }

    res.status(200).json({
        success:true,
        products
    })
})

export const getProductsByCollectionId= asyncHandler(async (req, res)=>{
    let {id:collectionId} =req.params;


    if(!collectionId){
        throw new CustomError("Collection ID is required", 500)
    }

    const products =Product.find({collectionId});

    if(!products){
        throw new CustomError("No products avilable", 404)
    }

    res.status(200).json({
        success:true,
        products
    })
})


export const deleteProduct=asyncHandler(async (req,res)=>{
    let {id:productId} =req.params;
    if(!productId){
        throw new CustomError("Product Id is required", 500)
    }

    const product =Product.findById(productId);

    if(!product){
        throw new CustomError("No product found", 404);
    }

    const deletePhotos=Promise.all(
        product.photos.map(async (ele, index)=>{
            await s3DeleteFile({
                bucketName: config.s3_BUCKET_NAME,
                key: `product/${productId}/image_${index+1}.png`
            })
        })
    )
    
    //deleting product photos from AWS
    await deletePhotos;
    
    //deleting entrys from DATABASE
    await product.remove();

    res.status(200).json({
        success:true,
        message:"Product deleted sucessfully"
    })
})