// src/routes/commentRoutes.ts

import express from 'express';
import * as commentController from '../controllers/commentController';
import { authenticateToken } from '../auth/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Añade un comentario a un post
 *     description: Solo usuarios autenticados pueden añadir comentarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post al que se agregará el comentario
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario añadido con éxito
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/posts/:postId/comments', authenticateToken, commentController.addComment);

/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}:
 *   put:
 *     summary: Actualiza un comentario existente
 *     description: Solo usuarios autenticados pueden actualizar comentarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post al que pertenece el comentario
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID del comentario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario actualizado con éxito
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.put('/posts/:postId/comments/:commentId', authenticateToken, commentController.updateCommentById);

/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Elimina un comentario existente
 *     description: Solo usuarios autenticados pueden eliminar comentarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post al que pertenece el comentario
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID del comentario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentario eliminado con éxito
 *       401:
 *         description: No autorizado
 */
router.delete('/posts/:postId/comments/:commentId', authenticateToken, commentController.deleteCommentById);

/**
 * @swagger
 * /api/comments/author/{author}:
 *   get:
 *     summary: Obtiene comentarios de un autor específico
 *     description: Recupera los comentarios hechos por un autor determinado
 *     parameters:
 *       - in: path
 *         name: author
 *         required: true
 *         description: Nombre del autor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentarios del autor
 *       404:
 *         description: No se encontraron comentarios
 */
router.get('/comments/author/:author', commentController.getCommentsByAuthor);

export default router;
