import {
  createComment,
  getComments,
  updateComment,
  deleteComment
} from '@/api/comment';
import {
  ICreateComment,
  IUpdateComment,
  IGetCommentsParams
} from '@/interface/request/comment';
import {
  ICommentResponse,
  ICommentsListResponse,
  IDeleteCommentResponse
} from '@/interface/response/comment';
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

export const useCreateComment = (): UseMutationResult<ICommentResponse, Error, ICreateComment> => {
  const queryClient = useQueryClient();

  return useMutation<ICommentResponse, Error, ICreateComment>({
    mutationFn: (commentData: ICreateComment) => createComment(commentData),
    onSuccess: (_, variables) => {
      // Invalidate queries based on the comment's target (forum post, task, document, etc.)
      if (variables.forumPost) {
        queryClient.invalidateQueries({
          queryKey: ['comments', { forumPost: variables.forumPost }],
        });
        queryClient.invalidateQueries({
          queryKey: ['forumPost', variables.forumPost],
        });
      }
      if (variables.task) {
        queryClient.invalidateQueries({
          queryKey: ['comments', { task: variables.task }],
        });
        queryClient.invalidateQueries({
          queryKey: ['task', variables.task],
        });
      }
      if (variables.document) {
        queryClient.invalidateQueries({
          queryKey: ['comments', { document: variables.document }],
        });
        queryClient.invalidateQueries({
          queryKey: ['document', variables.document],
        });
      }
      if (variables.parentComment) {
        queryClient.invalidateQueries({
          queryKey: ['comments', { parentComment: variables.parentComment }],
        });
      }
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useGetComments = (params?: IGetCommentsParams) => {
  return useQuery<ICommentsListResponse, Error>({
    queryKey: ['comments', params],
    queryFn: () => getComments(params),
  });
};

export const useUpdateComment = (): UseMutationResult<
  ICommentResponse,
  Error,
  { id: string; payload: IUpdateComment }
> => {
  const queryClient = useQueryClient();

  return useMutation<ICommentResponse, Error, { id: string; payload: IUpdateComment }>({
    mutationFn: ({ id, payload }) => updateComment(id, payload),
    onSuccess: (result) => {
      // Invalidate queries based on the comment's target
      if (result.data.forumPost) {
        queryClient.invalidateQueries({
          queryKey: ['comments', { forumPost: result.data.forumPost }],
        });
      }
      if (result.data.task) {
        queryClient.invalidateQueries({
          queryKey: ['comments', { task: result.data.task }],
        });
      }
      if (result.data.document) {
        queryClient.invalidateQueries({
          queryKey: ['comments', { document: result.data.document }],
        });
      }
      if (result.data.parentComment) {
        queryClient.invalidateQueries({
          queryKey: ['comments', { parentComment: result.data.parentComment }],
        });
      }
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteComment = (): UseMutationResult<IDeleteCommentResponse, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<IDeleteCommentResponse, Error, string>({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      // Invalidate all comments queries since we don't know which specific one to invalidate
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
}; 