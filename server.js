import express from "express";
import AuthRouter from './src/routes/Auth.routes.js'
import ReferrarRouter from './src/routes/Referrer.routes.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 6000;

const app = express();

app.use(cors({ credentials: true, origin: process.env.ORIGIN_URL }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World')
});
app.use("/api/auth", AuthRouter);
app.use("/api/rf", ReferrarRouter);

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))


