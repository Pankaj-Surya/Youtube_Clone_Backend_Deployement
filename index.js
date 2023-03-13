import express from 'express';
import mongoose from "mongoose"
//import {PORT,MONGO} from  "./config/serverConfig.js"
import dotenv from "dotenv";
import userRoutes from "./routes/users.js"
import commentRoutes from "./routes/comments.js"
import videoRoutes from "./routes/videos.js"
import authRoutes from "./routes/auth.js" 
import cookieParser from  "cookie-parser"
import cors from 'cors'
dotenv.config()

const app = express();

//console.log(PORT,MONGO)

const PORT = process.env.PORT || 8010

const connect = ( )=>{
    mongoose.connect(process.env.MONGO).then(()=>{
        console.log("Connected to DB")
    }).catch((err)=>{
        console.log(err)
    })
}



const corsOptions = {
    origin: true , //included origin as true
    credentials: true, //included credentials as true
};

app.use(cors(corsOptions));
//console.log(cookieParser())
app.use(cookieParser())
//middlewares
//app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/videos",videoRoutes)
app.use("/api/comments",commentRoutes)


//error handler
app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
      success: false,
      status,
      message,
    });   
})

app.listen(PORT,()=>{
    connect()
    console.log(`connecting to ${process.env.PORT}`)
})



