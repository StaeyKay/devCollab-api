import express from 'express';
import connectDb from './config/db.js';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
    connectDb();
    console.log(`App is listening on port ${PORT}`)
})