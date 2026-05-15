import express, { Application, Request, Response } from 'express';
import { config } from 'dotenv';
import connectDB from './db/db';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors'
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import routes from './routes';

const app: Application = express();
config();

// Database connection
connectDB();

// middleware
app.use(helmet()); // security middleware to set various HTTP headers for app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// cors
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}))

// global error
app.use(globalErrorHandler);

// log http req to console
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"))
}

const PORT = process.env.PORT || 4001;



// health check
app.get('/api/health', (req: Request, res: Response) => {
    return res.status(200).send({ success: true, message: 'Server running....' });
})

// all api endpoint
app.use('/api',routes);

app.listen(PORT, () => {
    console.log(`Server is started at ${PORT}`);
})

