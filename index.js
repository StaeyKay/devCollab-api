import express from 'express';
import cors from 'cors';
import connectDb from './config/db.js';

import UserRouter from './routes/user.js';
import ProjectRouter from './routes/project.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

const PORT = process.env.PORT || 5000;

// Apply middlwares
app.use(express.json());

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use('/api/auth', UserRouter);
app.use('/api/project', ProjectRouter );


app.use(errorHandler)

app.listen(PORT, () => {
    connectDb();
    console.log(`App is listening on port ${PORT}`);
})