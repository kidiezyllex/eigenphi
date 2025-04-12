export interface ICreateForumPost {
  title: string;
  content: string;
  project: string;
  attachments?: string[];
  tags?: string[];
  isPinned?: boolean;
}

export interface IUpdateForumPost {
  title?: string;
  content?: string;
  attachments?: string[];
  tags?: string[];
  isPinned?: boolean;
}

export interface IGetForumPostsParams {
  project?: string;
  author?: string;
  tag?: string;
  isPinned?: boolean;
} 