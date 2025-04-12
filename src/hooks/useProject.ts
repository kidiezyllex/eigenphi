import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
} from '@/api/project';
import {
  ICreateProject,
  IUpdateProject,
  IAddProjectMember
} from '@/interface/request/project';
import {
  IProjectResponse,
  IProjectsListResponse,
  IDeleteProjectResponse
} from '@/interface/response/project';
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

export const useCreateProject = (): UseMutationResult<IProjectResponse, Error, ICreateProject> => {
  const queryClient = useQueryClient();

  return useMutation<IProjectResponse, Error, ICreateProject>({
    mutationFn: (projectData: ICreateProject) => createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useGetProjects = () => {
  return useQuery<IProjectsListResponse, Error>({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
  });
};

export const useGetProjectById = (id: string) => {
  return useQuery<IProjectResponse, Error>({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
};

export const useUpdateProject = (): UseMutationResult<
  IProjectResponse,
  Error,
  { id: string; payload: IUpdateProject }
> => {
  const queryClient = useQueryClient();

  return useMutation<IProjectResponse, Error, { id: string; payload: IUpdateProject }>({
    mutationFn: ({ id, payload }) => updateProject(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      queryClient.invalidateQueries({
        queryKey: ['project', variables.id],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteProject = (): UseMutationResult<IDeleteProjectResponse, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<IDeleteProjectResponse, Error, string>({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useAddProjectMember = (): UseMutationResult<
  IProjectResponse,
  Error,
  { projectId: string; memberData: IAddProjectMember }
> => {
  const queryClient = useQueryClient();

  return useMutation<IProjectResponse, Error, { projectId: string; memberData: IAddProjectMember }>({
    mutationFn: ({ projectId, memberData }) => addProjectMember(projectId, memberData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      queryClient.invalidateQueries({
        queryKey: ['project', variables.projectId],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useRemoveProjectMember = (): UseMutationResult<
  IProjectResponse,
  Error,
  { projectId: string; userId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation<IProjectResponse, Error, { projectId: string; userId: string }>({
    mutationFn: ({ projectId, userId }) => removeProjectMember(projectId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      queryClient.invalidateQueries({
        queryKey: ['project', variables.projectId],
      });
      return;
    },
    onError: (error) => {
      return error;
    },
  });
}; 