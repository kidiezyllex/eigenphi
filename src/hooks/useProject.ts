import { useState } from 'react';
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
import { IProject } from '@/interface/response/project';

export const useProject = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách dự án
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProjects();
      setProjects(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách dự án');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết dự án theo ID
  const fetchProjectById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProjectById(id);
      setCurrentProject(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin dự án');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Tạo dự án mới
  const create = async (projectData: ICreateProject) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createProject(projectData);
      // Thêm dự án mới vào state
      if (response.success) {
        setProjects(prevProjects => [response.data, ...prevProjects]);
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tạo dự án mới');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật dự án
  const update = async (id: string, projectData: IUpdateProject) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateProject(id, projectData);
      // Cập nhật state
      if (response.success) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project._id === id ? response.data : project
          )
        );
        if (currentProject && currentProject._id === id) {
          setCurrentProject(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật dự án');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa dự án
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteProject(id);
      // Xóa dự án khỏi state nếu thành công
      if (response.success) {
        setProjects(prevProjects => 
          prevProjects.filter(project => project._id !== id)
        );
        if (currentProject && currentProject._id === id) {
          setCurrentProject(null);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể xóa dự án');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Thêm thành viên vào dự án
  const addMember = async (projectId: string, memberData: IAddProjectMember) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addProjectMember(projectId, memberData);
      // Cập nhật state
      if (response.success) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project._id === projectId ? response.data : project
          )
        );
        if (currentProject && currentProject._id === projectId) {
          setCurrentProject(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể thêm thành viên vào dự án');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa thành viên khỏi dự án
  const removeMember = async (projectId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await removeProjectMember(projectId, userId);
      // Cập nhật state
      if (response.success) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project._id === projectId ? response.data : project
          )
        );
        if (currentProject && currentProject._id === projectId) {
          setCurrentProject(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể xóa thành viên khỏi dự án');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    create,
    update,
    remove,
    addMember,
    removeMember
  };
}; 