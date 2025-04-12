import { useState } from 'react';
import { uploadFile as apiUploadFile, deleteFile as apiDeleteFile, getFileInfo as apiGetFileInfo } from '@/api/upload';
import { IUploadResponse, IDeleteFileResponse, IFileInfoResponse } from '@/interface/response/upload';
import { createFileFormData } from '@/utils/cloudinary';

export const useUpload = () => {
  const [loading, setLoading] = useState(false);

  // Upload file trực tiếp - không sử dụng React Query mutation
  const uploadFile = async (file: File, metadata?: Record<string, any>): Promise<IUploadResponse> => {
    try {
      setLoading(true);
      const formData = createFileFormData(file, metadata || {
        title: file.name.split('.')[0],
      });
      
      const response = await apiUploadFile(formData);
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete file trực tiếp
  const deleteFileDirectly = async (id: string): Promise<IDeleteFileResponse> => {
    try {
      setLoading(true);
      const response = await apiDeleteFile(id);
      return response;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get file info
  const getFileInfo = async (id: string): Promise<IFileInfoResponse> => {
    try {
      setLoading(true);
      const response = await apiGetFileInfo(id);
      return response;
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadFile,
    deleteFileDirectly,
    getFileInfo,
    loading
  };
};
