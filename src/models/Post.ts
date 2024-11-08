import { Schema, model, Document } from 'mongoose';

// Definir la interfaz para el modelo de Post
interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

// Definir el esquema de Post
const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Crear el modelo de Post
const Post = model<IPost>('Post', PostSchema);

export default Post;
