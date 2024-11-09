// src/controllers/commentController.ts

import { Request, Response } from 'express';
import Post from '../models/Post';
import { v4 as uuidv4 } from 'uuid';

export const addComment = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId; // Accede al userId del usuario autenticado

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

export const updateCommentById = async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;

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

export const deleteCommentById = async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const userId = req.user?.userId;

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