import {
  createUserComment,
  getUserComments,
  updateUserComment,
  deleteUserComment
} from '@/api/user';
import {
  ICreateUserComment,
  IUpdateUserComment,
  IGetUserCommentsParams
} from '@/interface/request/user';
import {
  IUserCommentResponse,
  IUserCommentsListResponse,
  IDeleteUserCommentResponse
} from '@/interface/response/user';
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

export const useCreateUserComment = (): UseMutationResult<IUserCommentResponse, Error, ICreateUserComment> => {
  const queryClient = useQueryClient();

  return useMutation<IUserCommentResponse, Error, ICreateUserComment>({
    mutationFn: (commentData: ICreateUserComment) => createUserComment(commentData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['userComments', variables.userId],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useGetUserComments = (params?: IGetUserCommentsParams) => {
  return useQuery<IUserCommentsListResponse, Error>({
    queryKey: ['userComments', params?.userId],
    queryFn: () => getUserComments(params),
    enabled: !!params?.userId,
  });
};

export const useUpdateUserComment = (): UseMutationResult<
  IUserCommentResponse, 
  Error, 
  { commentId: string; data: IUpdateUserComment }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    IUserCommentResponse, 
    Error, 
    { commentId: string; data: IUpdateUserComment }
  >({
    mutationFn: ({ commentId, data }) => updateUserComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userComments'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteUserComment = (): UseMutationResult<
  IDeleteUserCommentResponse,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<IDeleteUserCommentResponse, Error, string>({
    mutationFn: (commentId: string) => deleteUserComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userComments'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
}; 