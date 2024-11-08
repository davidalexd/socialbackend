import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postRoutes from './routes/PostRoutes';


dotenv.config();

const app = express();
const port = Number(process.env.PORT)  || 3000;
const hostname = process.env.HOST!;

// Middleware para parsear cuerpos JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.log('Error al conectar a MongoDB:', error));

// Usar las rutas de post y comentarios
app.use('/api', postRoutes);

// Iniciar el servidor
app.listen(port, hostname, () => {
    console.log(`Servidor corriendo en http://${hostname}:${port}`);
  });
