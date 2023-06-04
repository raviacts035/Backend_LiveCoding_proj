import mongoose from "mongoose";

const postSchema= new mongoose.Schema(
{
    title:{
        type:String,
        required:[true,"Title is required"],
        maxLength:[150,"Title must be less then 150 Chars"],
    },
    discription:{
        type:String,
        required:[true,"discription is required"]
    },
    authorId:{
        type: Number,
        required:[true,"ID is required"],
    },
},{timestamps:true}
)


export default mongoose.model("Post",postSchema)