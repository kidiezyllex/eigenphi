import { useState } from 'react';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '@/api/task';
import {
  ICreateTask,
  IUpdateTask,
  IGetTasksParams
} from '@/interface/request/task';
import { ITask } from '@/interface/response/task';

export const useTask = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [currentTask, setCurrentTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách nhiệm vụ
  const fetchTasks = async (params?: IGetTasksParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTasks(params);
      setTasks(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách nhiệm vụ');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết nhiệm vụ theo ID
  const fetchTaskById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTaskById(id);
      setCurrentTask(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin nhiệm vụ');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Tạo nhiệm vụ mới
  const create = async (taskData: ICreateTask) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createTask(taskData);
      // Thêm nhiệm vụ mới vào state
      if (response.success) {
        setTasks(prevTasks => [response.data, ...prevTasks]);
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tạo nhiệm vụ mới');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật nhiệm vụ
  const update = async (id: string, taskData: IUpdateTask) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateTask(id, taskData);
      // Cập nhật state
      if (response.success) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === id ? response.data : task
          )
        );
        if (currentTask && currentTask._id === id) {
          setCurrentTask(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật nhiệm vụ');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa nhiệm vụ
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteTask(id);
      // Xóa nhiệm vụ khỏi state nếu thành công
      if (response.success) {
        setTasks(prevTasks => 
          prevTasks.filter(task => task._id !== id)
        );
        if (currentTask && currentTask._id === id) {
          setCurrentTask(null);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể xóa nhiệm vụ');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái nhiệm vụ (hàm tiện ích)
  const updateStatus = async (id: string, status: string) => {
    return update(id, { status });
  };

  // Cập nhật tiến độ nhiệm vụ (hàm tiện ích)
  const updateProgress = async (id: string, progress: number) => {
    return update(id, { progress });
  };

  return {
    tasks,
    currentTask,
    loading,
    error,
    fetchTasks,
    fetchTaskById,
    create,
    update,
    remove,
    updateStatus,
    updateProgress
  };
}; 