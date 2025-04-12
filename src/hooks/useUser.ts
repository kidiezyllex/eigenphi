import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '@/api/user';
import { IUpdateUser } from '@/interface/request/user';
import {
  IUserResponse,
  IUsersListResponse,
  IDeleteUserResponse
} from '@/interface/response/user';
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

export const useGetUsers = () => {
  return useQuery<IUsersListResponse, Error>({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
};

export const useGetUserById = (id: string) => {
  return useQuery<IUserResponse, Error>({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = (): UseMutationResult<
  IUserResponse,
  Error,
  { id: string; payload: IUpdateUser }
> => {
  const queryClient = useQueryClient();

  return useMutation<IUserResponse, Error, { id: string; payload: IUpdateUser }>({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user', variables.id],
      });
      // Nếu đang cập nhật hồ sơ người dùng hiện tại, invalidate cả hồ sơ
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteUser = (): UseMutationResult<IDeleteUserResponse, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<IDeleteUserResponse, Error, string>({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
}; 