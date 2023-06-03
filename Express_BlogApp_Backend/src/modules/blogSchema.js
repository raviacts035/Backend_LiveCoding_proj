import mongoose from "mongoose";

const blogSchema= new mongoose.Schema(
{
    title:{
        type:String,
        required:[true,"Title is required"],
        maxLength:[150,"Title must be less then 150 Chars"],
    },
    text:{
        type:String,
        required:[true,"discription is required"]
    },
    author:{
        type:String,
        required:[true,"Author name is required"]
    },
    likeCount:{
        type: Number,
        default: 0
    }
},{timestamps:true}
)



export default mongoose.model("Blog",blogSchema)