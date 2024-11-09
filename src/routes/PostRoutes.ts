// src/routes/postRoutes.ts

import express from 'express';
import * as postController from '../controllers/postController';
import { authenticateToken } from '../auth/authMiddleware';

const router = express.Router();

// Solo usuarios autenticados pueden crear, actualizar y eliminar posts
router.post('/posts', authenticateToken, postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:postId', postController.getPostById);
router.get('/posts/title/:title', postController.getPostsByTitle);
router.get('/posts/author/:author', postController.getPostsByAuthor);
router.put('/posts/:postId', authenticateToken, postController.updatePostById);
router.delete('/posts/:postId', authenticateToken, postController.deletePostById);

export default router;
