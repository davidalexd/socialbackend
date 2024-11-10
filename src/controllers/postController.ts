// src/controllers/postController.ts

import { Request, Response } from 'express';
import Post from '../models/Post';

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crea un nuevo post.
 *     description: Crea un post y lo guarda en la base de datos.
 *     parameters:
 *       - in: body
 *         name: post
 *         description: Los datos del post a crear.
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - content
 *             - userId
 *           properties:
 *             title:
 *               type: string
 *               description: El título del post.
 *             content:
 *               type: string
 *               description: El contenido del post.
 *             userId:
 *               type: string
 *               description: El ID del usuario autenticado.
 *     responses:
 *       201:
 *         description: Post creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Usuario no autenticado.
 *       400:
 *         description: Error al crear el post.
 */
export const createPost = async (req: Request, res: Response) => {
    const { title, content, user } = req.body;
    const userId = user?.userId;

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

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtiene todos los posts.
 *     description: Devuelve una lista de todos los posts en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Error al obtener los posts.
 */
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los posts', error });
    }
};

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Obtiene un post por su ID.
 *     description: Devuelve un post específico utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: El ID del post a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post no encontrado.
 *       400:
 *         description: Error al obtener el post.
 */
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

/**
 * @swagger
 * /posts/title/{title}:
 *   get:
 *     summary: Obtiene posts por título.
 *     description: Busca posts que contengan el título especificado.
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         description: El título a buscar en los posts.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Error al obtener los posts.
 */
export const getPostsByTitle = async (req: Request, res: Response) => {
    const { title } = req.params;

    try {
        const posts = await Post.find({ title: new RegExp(title, 'i') });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener los posts' });
    }
};

/**
 * @swagger
 * /posts/author/{author}:
 *   get:
 *     summary: Obtiene posts por autor.
 *     description: Devuelve todos los posts escritos por un autor específico.
 *     parameters:
 *       - in: path
 *         name: author
 *         required: true
 *         description: El ID del autor.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Error al obtener los posts.
 */
export const getPostsByAuthor = async (req: Request, res: Response) => {
    const { author } = req.params;

    try {
        const posts = await Post.find({ author });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener los posts' });
    }
};

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Actualiza un post por su ID.
 *     description: Actualiza los datos de un post si el usuario autenticado es el autor.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: El ID del post a actualizar.
 *         schema:
 *           type: string
 *       - in: body
 *         name: post
 *         description: Los datos del post a actualizar.
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             content:
 *               type: string
 *             userId:
 *               type: string
 *     responses:
 *       200:
 *         description: Post actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post no encontrado.
 *       403:
 *         description: No autorizado para actualizar el post.
 *       400:
 *         description: Error al actualizar el post.
 */
export const updatePostById = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { title, content, user } = req.body;
    const userId = user?.userId;

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

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Elimina un post por su ID.
 *     description: Elimina un post específico si el usuario autenticado es el autor.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: El ID del post a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post eliminado exitosamente.
 *       404:
 *         description: Post no encontrado.
 *       403:
 *         description: No autorizado para eliminar el post.
 *       400:
 *         description: Error al eliminar el post.
 */
export const deletePostById = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { user } = req.body;
    const userId = user?.userId;

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
