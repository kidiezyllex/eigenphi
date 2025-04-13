export interface IFileData {
  publicId: string;
  url: string;
  size?: number;
  format?: string;
  type?: string;
}

export interface IUploadedFile {
  _id: string;
  title: string;
  description?: string;
  category?: {
    _id: string;
    name: string;
  };
  project?: {
    _id: string;
    name: string;
  };
  task?: {
    _id: string;
    title: string;
  };
  creator: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  filePath: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  version: string;
  isShared: boolean;
  sharedWith: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IUploadResponse {
  status: boolean;
  message: string;
  data: {
    document: IUploadedFile;
    file: {
      path: string;
      publicUrl: string;
    };
  };
  errors: Record<string, any>;
  timestamp: string;
}

export interface IDeleteFileResponse {
  success: boolean;
  message: string;
}

export interface IFileInfoResponse {
  success: boolean;
  data: {
    document: IUploadedFile;
    downloadUrl: string;
  };
}
