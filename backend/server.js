import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173/",
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
}))

const PORT = process.env.PORT || 8080;
connectDB();

app.use("/api/users", userRouter);
app.use("/api/messages",messageRouter);

app.get("/",(req,res)=> {
    res.send("Hello World");
})

app.listen( PORT , ()=> {
    console.log(`server is running on port ${PORT}`);
})