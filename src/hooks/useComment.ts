import { useState } from 'react';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment
} from '@/api/comment';
import {
  ICreateComment,
  IUpdateComment,
  IGetCommentsParams
} from '@/interface/request/comment';
import { IComment } from '@/interface/response/comment';

export const useComment = () => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách bình luận
  const fetchComments = async (params?: IGetCommentsParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getComments(params);
      setComments(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải bình luận');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Thêm bình luận mới
  const addComment = async (commentData: ICreateComment) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createComment(commentData);
      // Thêm bình luận mới vào state
      if (response.success) {
        setComments(prevComments => [...prevComments, response.data]);
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tạo bình luận');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật bình luận
  const editComment = async (id: string, commentData: IUpdateComment) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateComment(id, commentData);
      // Cập nhật state comments
      if (response.success) {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment._id === id ? response.data : comment
          )
        );
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật bình luận');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa bình luận
  const removeComment = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteComment(id);
      // Xóa bình luận khỏi state
      if (response.success) {
        setComments(prevComments => 
          prevComments.filter(comment => comment._id !== id)
        );
        // Xóa cả các bình luận con
        setComments(prevComments => 
          prevComments.filter(comment => comment.parentComment !== id)
        );
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể xóa bình luận');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    editComment,
    removeComment
  };
}; 