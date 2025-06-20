import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from './routes/user.route.js';

app.use('/api/users', userRoutes);
export default app;