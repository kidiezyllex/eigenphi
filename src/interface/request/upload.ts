export interface IUploadFile {
  file: File;
  title: string;
  description?: string;
  category: string;
  project?: string;
  task?: string;
  version?: string;
  tags?: string[];
  isShared?: boolean;
  sharedWith?: string[];
}

export interface IFileInfo {
  id: string;
}
