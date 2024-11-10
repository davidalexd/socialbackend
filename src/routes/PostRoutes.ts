// src/routes/postRoutes.ts

import express from 'express';
import * as postController from '../controllers/postController';
import { authenticateToken } from '../auth/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crea un nuevo post
 *     description: Solo usuarios autenticados pueden crear posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post creado con éxito
 *       401:
 *         description: No autorizado
 */
router.post('/posts', authenticateToken, postController.createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtiene todos los posts
 *     description: Recupera la lista de todos los posts.
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get('/posts', postController.getAllPosts);

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Obtiene un post por su ID
 *     description: Recupera un post específico por su ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post encontrado
 *       404:
 *         description: Post no encontrado
 */
router.get('/posts/:postId', postController.getPostById);

/**
 * @swagger
 * /api/posts/title/{title}:
 *   get:
 *     summary: Obtiene posts por título
 *     description: Recupera posts que coinciden con el título proporcionado
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         description: Título del post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de posts encontrados
 *       404:
 *         description: No se encontraron posts
 */
router.get('/posts/title/:title', postController.getPostsByTitle);

/**
 * @swagger
 * /api/posts/author/{author}:
 *   get:
 *     summary: Obtiene posts por autor
 *     description: Recupera posts escritos por un autor específico
 *     parameters:
 *       - in: path
 *         name: author
 *         required: true
 *         description: Nombre del autor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de posts encontrados
 *       404:
 *         description: No se encontraron posts
 */
router.get('/posts/author/:author', postController.getPostsByAuthor);

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Actualiza un post existente
 *     description: Solo usuarios autenticados pueden actualizar posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post actualizado con éxito
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: No autorizado
 */
router.put('/posts/:postId', authenticateToken, postController.updatePostById);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Elimina un post existente
 *     description: Solo usuarios autenticados pueden eliminar posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post eliminado con éxito
 *       401:
 *         description: No autorizado
 */
router.delete('/posts/:postId', authenticateToken, postController.deletePostById);

export default router;
