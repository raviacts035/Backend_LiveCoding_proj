// FSJS2.0 8th feb-mega project

import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({

    name:{
        type:String,
        required:[true,"Name is required"],
        maxLength:[50,"Name must be less then 50 Chars"],
    },
    price:{
        type:String,
        required:true,
        maxLength: [6,"Price must be less then 6 digits"]
    },
    discription:{
        type : String,
        required :true,
        maxLength :[120, "Discription should be less then 120 charecters"]
    },
    
    photos:[
        {   
            publicID: {
                type: String,
                required: true
            },
            secureURL:{
                type:String,
                required:true
            }
        }
    ],
    stock :{
        type:Number,
        default:0
    },
    sold:{
        type: Number,
        default:0
    },
    collectionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    }
}, {timestamps:true})


export default mongoose.model("Product", ProductSchema)