import express from 'express';
import { register, login, getUserById } from './authController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rutas relacionadas con la autenticación y el registro de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Registra un nuevo usuario en la aplicación proporcionando un nombre de usuario, correo electrónico y contraseña.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error al registrar el usuario
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     description: Permite que un usuario inicie sesión proporcionando su correo electrónico y contraseña para obtener un token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Ingreso exitoso y token generado
 *       400:
 *         description: Error al intentar iniciar sesión
 *       401:
 *         description: Credenciales incorrectas
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/login', login);


/**
 * @swagger
 * /auth/user/{id}:
 *   get:
 *     summary: Obtener detalles de un usuario
 *     description: Devuelve los detalles de un usuario dado su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Error al obtener los datos del usuario
 */


router.get('/user/:id', getUserById);

export default router;
