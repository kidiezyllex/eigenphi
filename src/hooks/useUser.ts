import { useState } from 'react';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '@/api/user';
import { IUpdateUser } from '@/interface/request/user';
import { IUser } from '@/interface/response/user';

export const useUser = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách người dùng (chỉ admin)
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      setUsers(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách người dùng');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin người dùng theo ID
  const fetchUserById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserById(id);
      setCurrentUser(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin người dùng');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật thông tin người dùng
  const update = async (id: string, userData: IUpdateUser) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUser(id, userData);
      // Cập nhật state
      if (response.data) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === id ? response.data : user
          )
        );
        if (currentUser && currentUser._id === id) {
          setCurrentUser(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật thông tin người dùng');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa người dùng (chỉ admin)
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteUser(id);
      // Xóa người dùng khỏi state nếu thành công
      setUsers(prevUsers => 
        prevUsers.filter(user => user._id !== id)
      );
      if (currentUser && currentUser._id === id) {
        setCurrentUser(null);
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể xóa người dùng');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    update,
    remove
  };
}; 