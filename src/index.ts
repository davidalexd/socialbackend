// src/index.ts

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import postRoutes from './routes/PostRoutes';
import commentRoutes from './routes/commentRoutes';
import authRoutes from './auth/authRoutes';
import { authenticateToken } from './auth/authMiddleware';

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri as string)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.log('Error al conectar a MongoDB:', error));

app.use(express.json());

// Rutas de autenticación sin protección
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/api', authenticateToken, postRoutes);
app.use('/api', authenticateToken, commentRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
