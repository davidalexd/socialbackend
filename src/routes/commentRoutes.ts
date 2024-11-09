// src/routes/commentRoutes.ts

import express from 'express';
import * as commentController from '../controllers/commentController';
import { authenticateToken } from '../auth/authMiddleware';

const router = express.Router();

// Solo usuarios autenticados pueden crear, actualizar y eliminar comentarios
router.post('/posts/:postId/comments', authenticateToken, commentController.addComment);
router.put('/posts/:postId/comments/:commentId', authenticateToken, commentController.updateCommentById);
router.delete('/posts/:postId/comments/:commentId', authenticateToken, commentController.deleteCommentById);

// Opcional: aplicar autenticación para obtener comentarios de un autor específico
router.get('/comments/author/:author', commentController.getCommentsByAuthor);

export default router;
