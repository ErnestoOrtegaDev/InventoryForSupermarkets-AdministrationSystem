import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes'; 
import supermarketRoutes from './routes/supermarketRoutes';
import productRoutes from './routes/productRoutes';
import notificationRoutes from './routes/notificationRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import movementRoutes from './routes/movementRoutes';

// Configuring environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

//DB Connection
connectDB();

const frontendUrls = process.env.FRONTEND_URL || '';

const allowedOrigins = frontendUrls.split(',');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin blocked by CORS:', origin); 
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json()); 
app.use(cookieParser());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/supermarkets', supermarketRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/movements', movementRoutes);

/* Test Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    msg: 'API REST Inventarios - Funcionando correctamente',
    version: '1.0.0'
  });
});
*/

// Initialize server
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en el puerto ${PORT}`);
});