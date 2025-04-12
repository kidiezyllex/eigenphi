interface IAuthor {
  _id: string;
  fullName: string;
  avatar?: string;
}

export interface IComment {
  _id: string;
  content: string;
  author: IAuthor;
  forumPost?: string;
  task?: string;
  document?: string;
  user?: string;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICommentResponse {
  success: boolean;
  message: string;
  data: IComment;
}

export interface ICommentsListResponse {
  success: boolean;
  count: number;
  data: IComment[];
}

export interface IDeleteCommentResponse {
  success: boolean;
  message: string;
} 