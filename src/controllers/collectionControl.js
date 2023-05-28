import Collection from "../modules/collection.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js"


export const createCollection=asyncHandler(async (req,res)=>{
    let {name}=req;

    if (!name){
        throw new CustomError("Collection name is required",402)
    }

    let newCollection = await Collection.create({
        name
    }) 

    res.status(200).json({
        sucess : true,
        newCollection
    })
})


export const updateCollection=asyncHandler(async (req,res)=>{
    let {name}=req;
    // collecting ID of the collection to be updated from URL (parameter)
    let {id: collectionId}=req.params;

    if (!name){
        throw new CustomError("Collection name is required",402)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(collectionId,{
        name
    },{
        new:true,
        runValidators:true
    })

    if (!updateCollection){
        throw new CustomError("Collection not found",404)
    }

    res.status(200).json({
        sucess : true,
        updatedCollection
    })
})

export const deleteCollection=asyncHandler(async (req,res)=>{
    let {name}=req;
    // collecting ID of the collection to be updated from URL (parameter)
    let {id: collectionId}=req.params;

    if (!name){
        throw new CustomError("Collection name is required",402)
    }
    
    const collectionToDelete=await Collection.findById(collectionId);
    if (!collectionToDelete){
        throw new CustomError("collection not Found",404)
    }
    await collectionToDelete.remove()

    res.status(200).json({
        sucess:true,
        message: "Collection deleted Sucessfully"
    })
})

export const getCOllection=asyncHandler(async (req,res)=>{
    const allCOllection=Collection.find({})

    if(!allCOllection){
        throw new CustomError("Collection is Empty",404)
    }

    res.status(200).json({
        sucess:true,
        allCOllection,
    })
})

