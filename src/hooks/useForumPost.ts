import {
  createForumPost,
  getForumPosts,
  getForumPostById,
  updateForumPost,
  deleteForumPost
} from '@/api/forumPost';
import {
  ICreateForumPost,
  IUpdateForumPost,
  IGetForumPostsParams
} from '@/interface/request/forumPost';
import {
  IForumPostResponse,
  IForumPostsListResponse,
  IDeleteForumPostResponse
} from '@/interface/response/forumPost';
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

export const useCreateForumPost = (): UseMutationResult<IForumPostResponse, Error, ICreateForumPost> => {
  const queryClient = useQueryClient();

  return useMutation<IForumPostResponse, Error, ICreateForumPost>({
    mutationFn: (postData: ICreateForumPost) => createForumPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['forumPosts'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useGetForumPosts = (params?: IGetForumPostsParams) => {
  return useQuery<IForumPostsListResponse, Error>({
    queryKey: ['forumPosts', params],
    queryFn: () => getForumPosts(params),
  });
};

export const useGetForumPostById = (id: string) => {
  return useQuery<IForumPostResponse, Error>({
    queryKey: ['forumPost', id],
    queryFn: () => getForumPostById(id),
    enabled: !!id,
  });
};

export const useUpdateForumPost = (): UseMutationResult<
  IForumPostResponse,
  Error,
  { id: string; payload: IUpdateForumPost }
> => {
  const queryClient = useQueryClient();

  return useMutation<IForumPostResponse, Error, { id: string; payload: IUpdateForumPost }>({
    mutationFn: ({ id, payload }) => updateForumPost(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['forumPosts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['forumPost', variables.id],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteForumPost = (): UseMutationResult<IDeleteForumPostResponse, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<IDeleteForumPostResponse, Error, string>({
    mutationFn: (id: string) => deleteForumPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['forumPosts'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
}; 