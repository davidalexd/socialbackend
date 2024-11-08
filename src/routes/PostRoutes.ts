import express, { Request, Response } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';

const router = express.Router();

// Ruta para obtener todos los posts
router.get('/posts', async (req: Request, res: Response) => {
    try {
      const posts = await Post.find();  // Obtener todos los posts de la base de datos
      res.status(200).json(posts);  // Responder con el listado de posts
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los posts', error });
    }
  });

// Ruta para crear un nuevo Post
router.post('/posts', async (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  const newPost = new Post({
    title,
    content,
    author
  });

  try {
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el post' });
  }
});

// Ruta para comentar en un post
router.post('/posts/:postId/comments', async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  const newComment = new Comment({
    postId,
    author,
    content
  });

  try {
    const comment = await newComment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Error al agregar el comentario' });
  }
});

// Ruta para obtener los comentarios de un post
router.get('/posts/:postId/comments', async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener los comentarios' });
  }
});

export default router;
