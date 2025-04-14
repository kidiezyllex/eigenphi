interface IAuthor {
  _id: string;
  fullName: string;
  avatar?: string;
  email?: string;
  position?: string;
}

interface IProject {
  _id: string;
  name: string;
}

interface IAttachment {
  _id: string;
  title: string;
  fileType: string;
  filePath?: string;
  fileSize?: number;
  category?: string;
}

interface IComment {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  replies?: IComment[];
  createdAt: string;
  updatedAt: string;
}

export interface IForumPost {
  _id: string;
  title: string;
  content: string;
  author: IAuthor;
  project: IProject;
  attachments: IAttachment[];
  tags: string[];
  isPinned: boolean;
  viewCount: number;
  comments?: IComment[];
  createdAt: string;
  updatedAt: string;
}

export interface IForumPostResponse {
  success: boolean;
  message: string;
  data: IForumPost;
  status: boolean;
}

export interface IForumPostsListResponse {
  success: boolean;
  count: number;
  data: IForumPost[];
}

export interface IDeleteForumPostResponse {
  success: boolean;
  message: string;
} 