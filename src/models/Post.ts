import { Schema, model, Document, Types } from 'mongoose';

interface IComment extends Document {
  postId: Types.ObjectId;
  author: string;
  content: string;
  createdAt: Date;
  _id: Types.ObjectId;
}

interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  comments: Types.DocumentArray<IComment>; // Subdocumentos de Mongoose
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true }, 
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  comments: { type: [CommentSchema], default: [] }, // Asegura que es un arreglo de subdocumentos
  createdAt: { type: Date, default: Date.now },
});

const Post = model<IPost>('Post', PostSchema);

export default Post;
