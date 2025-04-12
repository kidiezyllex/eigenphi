interface ICategory {
  _id: string;
  name: string;
}

export interface ICreator {
  _id: string;
  fullName: string;
  avatar?: string;
  email?: string;
}

interface IProject {
  _id: string;
  name: string;
}

interface ITask {
  _id: string;
  title: string;
}

interface IComment {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IDocument {
  _id: string;
  title: string;
  description?: string;
  category?: ICategory;
  project?: IProject;
  task?: ITask;
  creator: ICreator;
  filePath: string;
  fileType: string;
  fileSize: number;
  version?: string;
  isShared: boolean;
  sharedWith: ICreator[];
  tags?: string[];
  comments?: IComment[];
  createdAt: string;
  updatedAt: string;
}

export interface IDocumentResponse {
  success: boolean;
  message: string;
  data: IDocument;
}

export interface IDocumentsListResponse {
  success: boolean;
  count: number;
  data: IDocument[];
}

export interface IDeleteDocumentResponse {
  success: boolean;
  message: string;
} 