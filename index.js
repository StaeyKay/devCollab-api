import express from 'express';
import cors from 'cors';
import connectDb from './config/db.js';
import UserRouter from './routes/user.js';
import ProjectRouter from './routes/project.js';
import JoinRequestRouter from './routes/joinRequest.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const PORT = process.env.PORT || 5000;

// Apply middlwares
app.use(express.json());

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


// For __dirname support in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded images from the "uploads" folder
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/api/auth', UserRouter);
app.use('/api/project', ProjectRouter );
app.use('/api/join-requests', JoinRequestRouter )
app.use(errorHandler)


app.listen(PORT, () => {
    connectDb();
    console.log(`App is listening on port ${PORT}`);
})