import postSchema from "../modules/postSchema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import fetch20Posts from "../utils/fetch20Posts.js"


export const addPost=asyncHandler(async (req,res)=>{
    const {title, body, id}=req.body;

    if (!title || !body || !id){
        throw new CustomError("All fields are required", 403)
    }

    const newPost=await postSchema.create({
        title: title,
        discription: body,
        authorId: id
    })

    if (!newPost) throw new CustomError("Unable create new Post",403)

    res.status(200).json({
        sucess: true,
        newPost
    })
})

export const getPosts=asyncHandler(async (req,res)=>{
    let postsList=await postSchema.find({})

    if (!postsList || postsList.length < 20){
        //Adding 20 dummy posts
        const posts=await fetch20Posts();
        console.log
        await posts.map(async post=>{
            await postSchema.create({
                title: post.title,
                discription: post.body,
                authorId: post.id
            })
        })
    }

    postsList=await postSchema.find({});
    postsList=postsList.slice(0,19);
    if(!postsList) throw new CustomError("Unable to create post's",404);

    res.status(200).json({
        sucess : true,
        postsList
    })
})

