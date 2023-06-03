import express from "express";
import router from "./routes/index.js";


const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Home Route
app.get("/", (_req,res)=>{
    return res.status(200).json({
        success:true,
        message: "Hello here you are in Ravi's Blog app"
    })
})

app.use("/api", router);

app.all("*", (_req,res)=>{
    return res.status(404).json({
        success: false ,
        message : "Unable to find the path requested"
    })
})

export default app