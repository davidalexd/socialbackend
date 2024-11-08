import { Schema, model, Document, Types } from 'mongoose';

// Definir la interfaz para el modelo de Comment
interface IComment extends Document {
  postId: Types.ObjectId;  // Cambiar de 'string' a 'Types.ObjectId'
  author: string;
  content: string;
  createdAt: Date;
}

// Definir el esquema de Comment
const CommentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true }, // Definir correctamente el tipo como ObjectId
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Crear el modelo de Comment
const Comment = model<IComment>('Comment', CommentSchema);

export default Comment;
