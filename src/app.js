import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/student.js';
import companyRoutes from './routes/company.js';
import { auth, adminAuth } from './middlewares/auth.js';


const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(cookieParser());
app.use(bodyParser.json());



app.use('/auth', authRoutes);
app.use('/admin', auth, adminAuth, adminRoutes);
app.use('/student', auth, studentRoutes);
app.use('/company', auth, adminAuth, companyRoutes);


export default app;