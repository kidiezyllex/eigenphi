import { useState } from 'react';
import {
  createDocumentCategory,
  getDocumentCategories,
  getDocumentCategoryById,
  updateDocumentCategory,
  deleteDocumentCategory
} from '@/api/documentCategory';
import {
  ICreateDocumentCategory,
  IUpdateDocumentCategory
} from '@/interface/request/documentCategory';
import { IDocumentCategory } from '@/interface/response/documentCategory';

export const useDocumentCategory = () => {
  const [categories, setCategories] = useState<IDocumentCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<IDocumentCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDocumentCategories();
      setCategories(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách danh mục');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết danh mục theo ID
  const fetchCategoryById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDocumentCategoryById(id);
      setCurrentCategory(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin danh mục');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Tạo danh mục mới
  const create = async (categoryData: ICreateDocumentCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createDocumentCategory(categoryData);
      // Thêm danh mục mới vào state
      if (response.success) {
        setCategories(prevCategories => [...prevCategories, response.data]);
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tạo danh mục mới');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật danh mục
  const update = async (id: string, categoryData: IUpdateDocumentCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateDocumentCategory(id, categoryData);
      // Cập nhật state
      if (response.success) {
        setCategories(prevCategories =>
          prevCategories.map(category =>
            category._id === id ? response.data : category
          )
        );
        if (currentCategory && currentCategory._id === id) {
          setCurrentCategory(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật danh mục');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa danh mục
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteDocumentCategory(id);
      // Xóa danh mục khỏi state nếu thành công
      if (response.success) {
        setCategories(prevCategories => 
          prevCategories.filter(category => category._id !== id)
        );
        if (currentCategory && currentCategory._id === id) {
          setCurrentCategory(null);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể xóa danh mục');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    currentCategory,
    loading,
    error,
    fetchCategories,
    fetchCategoryById,
    create,
    update,
    remove
  };
}; 