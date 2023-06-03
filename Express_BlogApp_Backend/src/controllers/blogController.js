import blogSchema from "../modules/blogSchema.js";
import postSchema from "../modules/blogSchema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";


// Creates new Blog with title, text and authorName
export const addBlog=asyncHandler(async (req,res)=>{
    const {title, text, author}=req.body;

    if (!title || !text || !author){
        throw new CustomError("All fields are required", 403)
    }

    const newBlog=await postSchema.create({
        title,
        text,
        author
    })

    if (!newBlog) throw new CustomError("Unable create new Blog",403)

    res.status(200).json({
        success: true,
        newBlog
    })
})


// Returns list of avilable blogs in DataBase
export const getBlogs=asyncHandler(async (req,res)=>{

    const blogList=await postSchema.find({});
    if(!blogList) throw new CustomError("No blogs Avilable",404);

    res.status(200).json({
        success : true,
        blogList
    })
})

// Updates title and text of existing blog by ID 
export const updateBlog=asyncHandler(async (req, res)=>{

    const {id , title, text }=req.body;

    //validation
    if (!id || !title || !text){
        throw new CustomError("Enter all required fields",403);
    }

   const updatedBlog=await blogSchema.findOneAndUpdate({_id:id},{text:text,title:title})

   if (!updatedBlog){
        throw new CustomError("Unable to Update blog, check requested parameters",404)
    }

    return res.status(200).json({
        success:true,
        updatedBlog
    })
})

// delete existing blog by ID
export const deleteBlog=asyncHandler(async (req,res)=>{
    // Id is required
    const {id }=req.body;
    
    //validation
    if (!id){
        throw new CustomError("Blog parameter Id if required",403);
    }

    const blogDeleted=await blogSchema.findOneAndDelete(id );
    if (!blogDeleted) throw new CustomError("Unable to delete blog",404);

    res.status(200).json({
        success:true,
        message : "Successfully deleted requested Blog"        
    })
})

// Add Like to Blog
export const addLike=asyncHandler(async (req,res)=>{
    const {id }=req.body;
    if (!id ){
        throw new CustomError("Blog Id field to be deleted is missing",403);
    }

    let blogToBeLiked=await blogSchema.findByIdAndUpdate(id,{$inc : {likeCount:1}});

    //Incrementing instance for response purpose
    blogToBeLiked.likeCount+=1;

    if(!blogToBeLiked) throw new CustomError("Unable to add Like", 404);

    res.status(200).json({
        success:true,
        newLikeCount: blogToBeLiked.likeCount   
    })

})