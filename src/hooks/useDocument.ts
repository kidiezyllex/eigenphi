import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  shareDocument,
  unshareDocument
} from '@/api/document';
import {
  IUploadDocument,
  IUpdateDocument,
  IGetDocumentsParams,
  IShareDocument
} from '@/interface/request/document';
import {
  IDocumentResponse,
  IDocumentsListResponse,
  IDeleteDocumentResponse
} from '@/interface/response/document';
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

export const useUploadDocument = (): UseMutationResult<IDocumentResponse, Error, IUploadDocument> => {
  const queryClient = useQueryClient();

  return useMutation<IDocumentResponse, Error, IUploadDocument>({
    mutationFn: (documentData: IUploadDocument) => uploadDocument(documentData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useGetDocuments = (params?: IGetDocumentsParams) => {
  return useQuery<IDocumentsListResponse, Error>({
    queryKey: ['documents', params],
    queryFn: () => getDocuments(params),
  });
};

export const useGetDocumentById = (id: string) => {
  return useQuery<IDocumentResponse, Error>({
    queryKey: ['document', id],
    queryFn: () => getDocumentById(id),
    enabled: !!id,
  });
};

export const useUpdateDocument = (): UseMutationResult<IDocumentResponse, Error, { id: string; payload: IUpdateDocument }> => {
  const queryClient = useQueryClient();

  return useMutation<IDocumentResponse, Error, { id: string; payload: IUpdateDocument }>({
    mutationFn: ({ id, payload }) => updateDocument(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
      queryClient.invalidateQueries({
        queryKey: ['document', variables.id],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteDocument = (): UseMutationResult<IDeleteDocumentResponse, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<IDeleteDocumentResponse, Error, string>({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useShareDocument = (): UseMutationResult<IDocumentResponse, Error, { id: string; payload: IShareDocument }> => {
  const queryClient = useQueryClient();

  return useMutation<IDocumentResponse, Error, { id: string; payload: IShareDocument }>({
    mutationFn: ({ id, payload }) => shareDocument(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
      queryClient.invalidateQueries({
        queryKey: ['document', variables.id],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useUnshareDocument = (): UseMutationResult<IDocumentResponse, Error, { documentId: string; userId: string }> => {
  const queryClient = useQueryClient();

  return useMutation<IDocumentResponse, Error, { documentId: string; userId: string }>({
    mutationFn: ({ documentId, userId }) => unshareDocument(documentId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
      queryClient.invalidateQueries({
        queryKey: ['document', variables.documentId],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
}; 