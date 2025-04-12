import { useState } from 'react';
import { uploadFile as apiUploadFile, deleteFile, getFileInfo } from '@/api/upload';
import { IUploadFile } from '@/interface/request/upload';
import { IDocument } from '@/interface/response/document';

interface IFileData {
  document: IDocument;
  downloadUrl?: string;
  publicUrl?: string;
  path?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    document: IDocument;
    file: {
      publicUrl: string;
      path: string;
    };
    url?: string;
  };
}

export const useUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<IFileData[]>([]);
  const [currentFile, setCurrentFile] = useState<IFileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Upload file mới
  const upload = async (fileData: IUploadFile): Promise<ApiResponse | null> => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const response = await apiUploadFile(fileData);
      
      const newFile = {
        document: response.data.document,
        publicUrl: response.data.file.publicUrl,
        path: response.data.file.path
      };
      
      setUploadedFiles(prevFiles => [newFile, ...prevFiles]);
      setCurrentFile(newFile);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải lên file');
      return null;
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  // Upload file đơn giản để trả về url
  const uploadFile = async (file: File): Promise<ApiResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const fileData: IUploadFile = {
        file: file,
        title: file.name,
        description: '',
        category: 'document'
      };
      
      return await upload(fileData);
    } catch (err: any) {
      setError(err.message || 'Không thể tải lên file');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa file
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteFile(id);
      
      if (response.success) {
        setUploadedFiles(prevFiles => 
          prevFiles.filter(file => file.document._id !== id)
        );
        
        if (currentFile && currentFile.document._id === id) {
          setCurrentFile(null);
        }
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể xóa file');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin file và URL download
  const getFileDownloadInfo = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getFileInfo(id);
      
      const fileInfo = {
        document: response.data.document,
        downloadUrl: response.data.downloadUrl
      };
      
      setCurrentFile(fileInfo);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy thông tin file');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Download file
  const downloadFile = async (id: string) => {
    try {
      const fileInfoResponse = await getFileDownloadInfo(id);
      
      if (!fileInfoResponse) {
        throw new Error('Không thể lấy thông tin file');
      }
      
      const { downloadUrl } = fileInfoResponse.data;
      const documentTitle = fileInfoResponse.data.document.title || 'download';
      
      // Tạo link download tạm thời và click để download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', documentTitle);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Không thể tải file');
      return false;
    }
  };

  return {
    uploadedFiles,
    currentFile,
    loading,
    error,
    progress,
    upload,
    uploadFile,
    remove,
    getFileDownloadInfo,
    downloadFile
  };
}; 