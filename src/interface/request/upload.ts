export interface IUploadFile {
  file: File;
  title: string;
  description?: string;
  category: string;
  project?: string;
  task?: string;
  version?: string;
  tags?: string[] | string;
  isShared?: boolean;
  sharedWith?: string[] | string;
} 