import express from 'express';
import connectDb from './config/db.js';
import UserRouter from './routes/user.js';
import ProjectRouter from './routes/project.js';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', UserRouter);
app.use('/api/project', ProjectRouter );

app.listen(PORT, () => {
    connectDb();
    console.log(`App is listening on port ${PORT}`)
})