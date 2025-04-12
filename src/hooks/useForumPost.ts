import { useState } from 'react';
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
import { IForumPost } from '@/interface/response/forumPost';

export const useForumPost = () => {
  const [posts, setPosts] = useState<IForumPost[]>([]);
  const [currentPost, setCurrentPost] = useState<IForumPost | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách bài viết
  const fetchPosts = async (params?: IGetForumPostsParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getForumPosts(params);
      setPosts(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách bài viết');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết bài viết theo ID
  const fetchPostById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getForumPostById(id);
      setCurrentPost(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin bài viết');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Tạo bài viết mới
  const create = async (postData: ICreateForumPost) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createForumPost(postData);
      // Thêm bài viết mới vào state
      if (response.success) {
        setPosts(prevPosts => [response.data, ...prevPosts]);
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tạo bài viết mới');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật bài viết
  const update = async (id: string, postData: IUpdateForumPost) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateForumPost(id, postData);
      // Cập nhật state
      if (response.success) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === id ? response.data : post
          )
        );
        if (currentPost && currentPost._id === id) {
          setCurrentPost(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật bài viết');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa bài viết
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteForumPost(id);
      // Xóa bài viết khỏi state nếu thành công
      if (response.success) {
        setPosts(prevPosts => 
          prevPosts.filter(post => post._id !== id)
        );
        if (currentPost && currentPost._id === id) {
          setCurrentPost(null);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể xóa bài viết');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    currentPost,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    create,
    update,
    remove
  };
}; 