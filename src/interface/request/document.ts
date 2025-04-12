export interface IUploadDocument {
  title: string;
  description?: string;
  category?: string;
  project?: string;
  task?: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  version?: string;
  tags?: string[];
  isShared?: boolean;
  sharedWith?: string[];
}

export interface IUpdateDocument {
  title?: string;
  description?: string;
  category?: string;
  project?: string;
  task?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  version?: string;
  tags?: string[];
  isShared?: boolean;
  sharedWith?: string[];
}

export interface IGetDocumentsParams {
  project?: string;
  category?: string;
  creator?: string;
  task?: string;
  search?: string;
  isShared?: boolean;
}

export interface IShareDocument {
  userIds: string[];
} 