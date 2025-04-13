import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createTaskNote,
  updateTaskNote,
  deleteTaskNote
} from '@/api/task';
import {
  ICreateTask,
  IUpdateTask,
  IGetTasksParams,
  ICreateTaskNote,
  IUpdateTaskNote
} from '@/interface/request/task';
import {
  ITaskResponse,
  ITasksListResponse,
  IDeleteTaskResponse,
  ITaskNoteResponse,
  IDeleteTaskNoteResponse
} from '@/interface/response/task';
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

export const useCreateTask = (): UseMutationResult<ITaskResponse, Error, ICreateTask> => {
  const queryClient = useQueryClient();

  return useMutation<ITaskResponse, Error, ICreateTask>({
    mutationFn: (taskData: ICreateTask) => createTask(taskData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      if (variables.project) {
        queryClient.invalidateQueries({
          queryKey: ['tasks', { project: variables.project }],
        });
      }
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useGetTasks = (params?: IGetTasksParams) => {
  return useQuery<ITasksListResponse, Error>({
    queryKey: ['tasks', params],
    queryFn: () => getTasks(params),
  });
};

export const useGetTaskById = (id: string) => {
  return useQuery<ITaskResponse, Error>({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });
};

export const useUpdateTask = (): UseMutationResult<
  ITaskResponse,
  Error,
  { id: string; payload: IUpdateTask }
> => {
  const queryClient = useQueryClient();

  return useMutation<ITaskResponse, Error, { id: string; payload: IUpdateTask }>({
    mutationFn: ({ id, payload }) => updateTask(id, payload),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      queryClient.invalidateQueries({
        queryKey: ['task', variables.id],
      });
      // Nếu kết quả có chứa project ID, thì invalidate query cho danh sách nhiệm vụ của dự án đó
      if (result.data?.project?._id) {
        queryClient.invalidateQueries({
          queryKey: ['tasks', { project: result.data.project._id }],
        });
      }
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteTask = (): UseMutationResult<IDeleteTaskResponse, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<IDeleteTaskResponse, Error, string>({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

// Các hàm tiện ích
export const useUpdateTaskStatus = (): UseMutationResult<
  ITaskResponse,
  Error,
  { id: string; status: string }
> => {
  const queryClient = useQueryClient();

  return useMutation<ITaskResponse, Error, { id: string; status: string }>({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      queryClient.invalidateQueries({
        queryKey: ['task', variables.id],
      });
      if (result.data?.project?._id) {
        queryClient.invalidateQueries({
          queryKey: ['tasks', { project: result.data.project._id }],
        });
      }
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useUpdateTaskProgress = (): UseMutationResult<
  ITaskResponse,
  Error,
  { id: string; progress: number }
> => {
  const queryClient = useQueryClient();

  return useMutation<ITaskResponse, Error, { id: string; progress: number }>({
    mutationFn: ({ id, progress }) => updateTask(id, { progress }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useCreateTaskNote = (): UseMutationResult<ITaskNoteResponse, Error, ICreateTaskNote> => {
  const queryClient = useQueryClient();

  return useMutation<ITaskNoteResponse, Error, ICreateTaskNote>({
    mutationFn: (noteData: ICreateTaskNote) => createTaskNote(noteData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.taskId],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useUpdateTaskNote = (): UseMutationResult<
  ITaskNoteResponse, 
  Error, 
  { taskId: string; noteId: string; data: IUpdateTaskNote }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    ITaskNoteResponse, 
    Error, 
    { taskId: string; noteId: string; data: IUpdateTaskNote }
  >({
    mutationFn: ({ taskId, noteId, data }) => updateTaskNote(taskId, noteId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.taskId],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteTaskNote = (): UseMutationResult<
  IDeleteTaskNoteResponse, 
  Error, 
  { taskId: string; noteId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    IDeleteTaskNoteResponse, 
    Error, 
    { taskId: string; noteId: string }
  >({
    mutationFn: ({ taskId, noteId }) => deleteTaskNote(taskId, noteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.taskId],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
}; 