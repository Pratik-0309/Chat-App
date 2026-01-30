import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

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

app.get("/",(req,res)=> {
    res.send("Hello World");
})

app.listen( PORT , ()=> {
    console.log(`server is running on port ${PORT}`);
})