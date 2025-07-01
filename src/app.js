import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from "cors";
const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use(cors({
  origin: true, // or set your frontend origin
  credentials: true,
}));
app.get("/", (req, res) => {
  res.send("🚀 DevConnect API is Live");
});


import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';

app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);

export default app;