// src/models/Post.ts

import { Schema, model, Document } from 'mongoose';

interface IComment {
  commentId: string;
  author: string;
  content: string;
  createdAt: Date;
}

interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  comments: IComment[];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  commentId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  comments: { type: [CommentSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Post = model<IPost>('Post', PostSchema);

export default Post;
