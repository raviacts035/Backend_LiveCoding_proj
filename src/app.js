import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";


const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())
app.get("/", (req,res)=>{
    return res.status(200).json({
        message: "Hello here you are in ravi's web app"
    })
})

app.use("/api", router)

app.all("*", (_req,res)=>{
    res.status(404).json({
        success: false ,
        message : "Unable to find the path requested"
    })
})

export default app