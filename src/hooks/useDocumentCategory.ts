import {
  createDocumentCategory,
  getDocumentCategories,
  getDocumentCategoryById,
  updateDocumentCategory,
  deleteDocumentCategory
} from '@/api/documentCategory';
import {
  ICreateDocumentCategory,
  IUpdateDocumentCategory
} from '@/interface/request/documentCategory';
import {
  IDocumentCategoryResponse,
  IDocumentCategoriesListResponse,
  IDeleteDocumentCategoryResponse
} from '@/interface/response/documentCategory';
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useState } from 'react';
import { uploadFile as apiUploadFile, deleteFile as apiDeleteFile, getFileInfo as apiGetFileInfo } from '@/api/upload';
import { IUploadResponse, IDeleteFileResponse, IFileInfoResponse } from '@/interface/response/upload';
import { createFileFormData } from '@/utils/cloudinary';
export const useCreateDocumentCategory = (): UseMutationResult<IDocumentCategoryResponse, Error, ICreateDocumentCategory> => {
  const queryClient = useQueryClient();

  return useMutation<IDocumentCategoryResponse, Error, ICreateDocumentCategory>({
    mutationFn: (categoryData: ICreateDocumentCategory) => createDocumentCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documentCategories'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useGetDocumentCategories = () => {
  return useQuery<IDocumentCategoriesListResponse, Error>({
    queryKey: ['documentCategories'],
    queryFn: () => getDocumentCategories(),
  });
};

export const useGetDocumentCategoryById = (id: string) => {
  return useQuery<IDocumentCategoryResponse, Error>({
    queryKey: ['documentCategory', id],
    queryFn: () => getDocumentCategoryById(id),
    enabled: !!id,
  });
};

export const useUpdateDocumentCategory = (): UseMutationResult<
  IDocumentCategoryResponse,
  Error,
  { id: string; payload: IUpdateDocumentCategory }
> => {
  const queryClient = useQueryClient();

  return useMutation<IDocumentCategoryResponse, Error, { id: string; payload: IUpdateDocumentCategory }>({
    mutationFn: ({ id, payload }) => updateDocumentCategory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['documentCategories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['documentCategory', variables.id],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteDocumentCategory = (): UseMutationResult<IDeleteDocumentCategoryResponse, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<IDeleteDocumentCategoryResponse, Error, string>({
    mutationFn: (id: string) => deleteDocumentCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documentCategories'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
}; 

export const useUpload = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Tạo mutation để upload file
  const uploadFileMutation = useMutation<IUploadResponse, Error, { file: File; metadata?: Record<string, any> }>({
    mutationFn: async ({ file, metadata }) => {
      setLoading(true);
      try {
        const formData = createFileFormData(file, metadata || {
          title: file.name.split('.')[0],
        });
        return await apiUploadFile(formData);
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documentCategories'],
      });
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      return error;
    },
  });

  // Tạo mutation để xóa file
  const deleteFileMutation = useMutation<IDeleteFileResponse, Error, string>({
    mutationFn: async (id: string) => {
      setLoading(true);
      try {
        return await apiDeleteFile(id);
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documentCategories'],
      });
    },
    onError: (error) => {
      console.error('Error deleting file:', error);
      return error;
    },
  });

  // Tạo mutation để lấy thông tin file
  const getFileInfoMutation = useMutation<IFileInfoResponse, Error, string>({
    mutationFn: async (id: string) => {
      setLoading(true);
      try {
        return await apiGetFileInfo(id);
      } finally {
        setLoading(false);
      }
    },
  });

  // Các hàm wrapper để tiện sử dụng
  const uploadFile = async (file: File, metadata?: Record<string, any>): Promise<IUploadResponse> => {
    return uploadFileMutation.mutateAsync({ file, metadata });
  };

  const deleteFileDirectly = async (id: string): Promise<IDeleteFileResponse> => {
    return deleteFileMutation.mutateAsync(id);
  };

  const getFileInfo = async (id: string): Promise<IFileInfoResponse> => {
    return getFileInfoMutation.mutateAsync(id);
  };

  return {
    uploadFile,
    deleteFileDirectly,
    getFileInfo,
    loading: loading || uploadFileMutation.isPending || deleteFileMutation.isPending || getFileInfoMutation.isPending
  };
};