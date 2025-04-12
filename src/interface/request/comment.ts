export interface ICreateComment {
  content: string;
  forumPost?: string;
  task?: string;
  document?: string;
  user?: string;
  parentComment?: string;
}

export interface IUpdateComment {
  content: string;
}

export interface IGetCommentsParams {
  forumPost?: string;
  task?: string;
  document?: string;
  user?: string;
  parentComment?: string;
} 