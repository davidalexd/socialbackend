// src/controllers/postController.ts

import { Request, Response } from 'express';
import Post from '../models/Post';

export const createPost = async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    try {
        const newPost = new Post({ title, content, author: userId });
        const post = await newPost.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el post' });
    }
};

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los posts', error });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener el post' });
    }
};

export const getPostsByTitle = async (req: Request, res: Response) => {
    const { title } = req.params;

    try {
        const posts = await Post.find({ title: new RegExp(title, 'i') });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener los posts' });
    }
};

export const getPostsByAuthor = async (req: Request, res: Response) => {
    const { author } = req.params;

    try {
        const posts = await Post.find({ author });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener los posts' });
    }
};

export const updatePostById = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    const userId = req.user?.userId;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });

        // Verificar si el usuario autenticado es el autor del post
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: 'No autorizado para actualizar este post' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el post' });
    }
};

export const deletePostById = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user?.userId;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });

        // Verificar si el usuario autenticado es el autor del post
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: 'No autorizado para eliminar este post' });
        }

        await post.deleteOne();
        res.status(200).json({ message: 'Post eliminado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar el post' });
    }
};
