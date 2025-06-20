import express from 'express';
import {connectDB} from './db/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Start Server
connectDB()
.then(() =>{
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
})
.catch((err)=>{
    console.log("mongoDB connection failed", err);
});
