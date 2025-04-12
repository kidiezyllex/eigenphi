import { IDocument } from "./document";

interface IFileInfo {
  path: string;
  publicUrl: string;
}

export interface IUploadResponse {
  success: boolean;
  message: string;
  data: {
    document: IDocument;
    file: IFileInfo;
  };
}

export interface IDeleteFileResponse {
  success: boolean;
  message: string;
}

export interface IFileInfoResponse {
  success: boolean;
  data: {
    document: IDocument;
    downloadUrl: string;
  };
} 