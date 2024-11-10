// src/controllers/commentController.ts

import { Request, Response } from 'express';
import Post from '../models/Post';
import { v4 as uuidv4 } from 'uuid';

/**
 * @swagger
 * /posts/{postId}/comments:
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
 *               user:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *     responses:
 *       201:
 *         description: Comentario añadido con éxito
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
export const addComment = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content, user } = req.body;
    const userId = user?.userId; 

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });

        const newComment = {
            commentId: uuidv4(),
            author: userId,
            content,
            createdAt: new Date()
        };

        post.comments.push(newComment);
        await post.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ error: 'Error al agregar el comentario' });
    }
};

/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
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
export const updateCommentById = async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const { content, user } = req.body;
    const userId = user?.userId;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });

        const comment = post.comments.find(c => c.commentId === commentId);
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

        if (comment.author !== userId) {
            return res.status(403).json({ message: 'No autorizado para actualizar este comentario' });
        }

        comment.content = content || comment.content;
        await post.save();

        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el comentario' });
    }
};

/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
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
export const deleteCommentById = async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const { user } = req.body;
    const userId = user?.userId;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });

        const commentIndex = post.comments.findIndex(c => c.commentId === commentId);
        if (commentIndex === -1) return res.status(404).json({ message: 'Comentario no encontrado' });

        const comment = post.comments[commentIndex];

        if (comment.author !== userId) {
            return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
        }

        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json({ message: 'Comentario eliminado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar el comentario' });
    }
};

/**
 * @swagger
 * /comments/author/{author}:
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
export const getCommentsByAuthor = async (req: Request, res: Response) => {
    const { author } = req.params;

    try {
        // Buscar todos los posts que contienen comentarios del autor
        const posts = await Post.find({ "comments.author": author });

        // Extraer los comentarios que coinciden con el autor
        const comments = posts.flatMap(post =>
            post.comments.filter(comment => comment.author === author)
        );

        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener los comentarios por autor' });
    }
};
