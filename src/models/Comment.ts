/*
import { Schema, model, Document, Types } from 'mongoose';

interface IComment extends Document {
  postId: Types.ObjectId;  // Tipo correcto para referenciar el ID de otro documento
  author: string;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment = model<IComment>('Comment', CommentSchema);

export default Comment;


*/
//Contenido sin uso