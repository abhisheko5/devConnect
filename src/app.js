import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

import userRoutes from './routes/user.route.js';

app.use('/api/users', userRoutes);
export default app;