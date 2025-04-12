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