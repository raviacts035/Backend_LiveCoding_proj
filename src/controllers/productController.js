import Product from "../modules/productSchema.js";
// import formidable from "formidable";
import asyncHandler from "../service/asyncHandler.js";
// import { s3FIleUpload, s3DeleteFile } from "../service/imageUploader.js";
import mongoose from "mongoose";
import CustomError from "../utils/CustomError.js";
// import fs from "fs";
import config from "../config/index.js";


export const addProduct =asyncHandler(async (req,res)=>{
    const productId= new mongoose.Types.ObjectId().toHexString();
    
    // const form = formidable({ multiples: true, keepExtensions:true });
    // form.parse(req, async (err, fields, files) => {
    //     if(err){
    //         throw new CustomError("Oops.. Something went wrong",500)
    //     }

    //     console.log(fields, files);

        // if(!fields.name || !fields.price || !fields.discription ){
        //         throw new CustomError("Enter all required fields", 500)
        // }
        
    //     // uploading recived files from front-end to AWS bucket
    //     // AWS uploads will return array of secureUrls of files 
    //     let imageArrayResponce=Promise.all(
    //         Object.keys(files).map(async (file, index)=>{
    //             let element=file[fileKey]
    //             let data=fs.readFileSync(element.filepath)
    //             const upload =await s3FIleUpload({
    //                 bucketName:config.s3_BUCKET_NAME,
    //                 key: `product/${productId}/image_${index+1}.png`,
    //                 body: data,
    //                 contentType: element.mimetype
    //             })
                
    //             return {
    //                 secure_url: upload.Location
    //             }
    //         })
    //     )
        
    //     let imageArray=await imageArrayResponce

        // // creating entry into DATABASE for new product
        // const product =await Product.create({
        //     _id: productId,
        //     name: fields.name,
        //     price:fields.price,
        //     discription: fields.discription,
        //     photos: imageArray,
        //      sold: 0,
        // })

        // if (!product){
        //     throw new CustomError("Unable to create new product entry in DB", 500);
        // }

        // res.status(200).json({
        //     success:true ,
        //     product
        // })
    // })

    const { name, price, discription, stock, collectionId} = req.body;
    if(!name || !price || !discription, !stock, !collectionId ){
        throw new CustomError("Enter all required product fields", 500)
    }
    console.log(req.body)
    console.log(productId)

    let productImages = [];
    if (req.files) {
        let Images = req.files;
        for (const productImage in Images) {
            console.log(Images[productImage].tempFilePath)
            let cloudinaryResult = await cloudinary.v2.uploader.upload(Images[productImage].tempFilePath, {
                folder: `${collectionID}/${productID}`
            });
            console.log(cloudinaryResult);
            productImages.push({
                publicID: cloudinaryResult.public_id,
                secureURL: cloudinaryResult.secure_url
            })
        }
    }

    // creating entry into DATABASE for new product
    const product =await Product.create({
        _id: productId,
        name: name,
        price: price,
        discription: discription,
        photos: productImages,
        stock,
        sold: 0,
        collectionId,
    })
    console.log(product._id+" Product id")
    if (!product){
        throw new CustomError("Unable to create new product entry in DB", 500);
    }

    res.status(200).json({
        success:true ,
        product
    })

})


// update Products
export const updateProduct = asyncHandler(async (req, res) => {

    const { name, price, discription, stock, collectionId} = req.body;
    if(!name || !price || !discription, !stock, !collectionId ){
        throw new CustomError("Enter all required fields", 500)
    }

    let{Id: productID }=req.params;
    if (!productID) throw new CustomError("Product ID is required in request params :(", 400);

    const productToUpdate = await Product.findById(productID);
    if (!productToUpdate) throw new CustomError("Unfortunately! We couldn't find that resource :(", 400);

    let productImages = [];

    if (req.files) {
        //Destroy the Existing Product Images in the Cloudinary
        productToUpdate?.productImages?.map(async (image) => await cloudinary.v2.uploader.destroy(image?.publicID));
        
        let Images = req.files;

        for (const productImage in Images) {
            console.log(Images[productImage].tempFilePath)
            let cloudinaryResult = await cloudinary.v2.uploader.upload(Images[productImage].tempFilePath, {
                folder: `${collectionID}/${productID}`
            });
            console.log(cloudinaryResult);
            productImages.push({
                publicID: cloudinaryResult.public_id,
                secureURL: cloudinaryResult.secure_url
            })
        }
    }

    
    const updatedProduct = await Product.findByIdAndUpdate(productID, {
        name: name,
        price:price,
        discription: discription,
        photos: productImages,
        stock,
        sold: 0,
        collectionId,
    }, {runValidators: false, new: false});

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.status(200).json({
        success: true,
        message: `Product is updated successfully :)`,
        updatedProduct
    });
});



// getProducts 
export const getProducts =asyncHandler(async (req,res)=>{
    const products =await Product.find({});

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
    let{Id: productId }=req.params;

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
    let{Id: productId }=req.params;

    if(!productId){
        throw new CustomError("Product Id is required", 500)
    }

    const productToDelete =await Product.findByIdAndDelete(productId);
    console.log(productToDelete)
    if(!productToDelete){
        throw new CustomError("No product found", 404);
    }

    // const deletePhotos=Promise.all(
    //     productToDelete.photos.map(async (ele, index)=>{
    //         await s3DeleteFile({
    //             bucketName: config.s3_BUCKET_NAME,
    //             key: `product/${productId}/image_${index+1}.png`
    //         })
    //     })
    // )
    //deleting product photos from AWS
    // await deletePhotos;
    
    //deleting entrys from DATABASE
    productToDelete?.productImages?.map(async (image) => await cloudinary.v2.uploader.destroy(image?.publicID));

    res.status(200).json({
        success:true,
        message:"Product deleted sucessfully"
    })
})