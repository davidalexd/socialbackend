// src/index.ts

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import postRoutes from './routes/PostRoutes';
import commentRoutes from './routes/commentRoutes';
import authRoutes from './auth/authRoutes';
import { authenticateToken } from './auth/authMiddleware';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

// Conectar a MongoDB
mongoose.connect(mongoUri as string)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.log('Error al conectar a MongoDB:', error));

app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RED SOCIAL DE POSTS Y COMENTARIOS',
      version: '1.0.0',
      description: 'API con Express,Mongo y Swagger',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/auth/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Servir la documentación Swagger en /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de autenticación sin protección
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/api', authenticateToken, postRoutes);
app.use('/api', authenticateToken, commentRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
