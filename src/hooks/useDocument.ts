import { useState } from 'react';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  shareDocument,
  unshareDocument
} from '@/api/document';
import {
  IUploadDocument,
  IUpdateDocument,
  IGetDocumentsParams,
  IShareDocument
} from '@/interface/request/document';
import { IDocument } from '@/interface/response/document';

export const useDocument = () => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<IDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách tài liệu
  const fetchDocuments = async (params?: IGetDocumentsParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDocuments(params);
      setDocuments(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách tài liệu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết tài liệu theo ID
  const fetchDocumentById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDocumentById(id);
      setCurrentDocument(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin tài liệu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Tải lên tài liệu mới
  const upload = async (documentData: IUploadDocument) => {
    setLoading(true);
    setError(null);
    try {
      const response = await uploadDocument(documentData);
      // Thêm tài liệu mới vào state nếu thành công
      if (response.success) {
        setDocuments(prevDocuments => [response.data, ...prevDocuments]);
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tải lên tài liệu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật tài liệu
  const update = async (id: string, documentData: IUpdateDocument) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateDocument(id, documentData);
      // Cập nhật state nếu thành công
      if (response.success) {
        setDocuments(prevDocuments =>
          prevDocuments.map(doc =>
            doc._id === id ? response.data : doc
          )
        );
        if (currentDocument && currentDocument._id === id) {
          setCurrentDocument(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật tài liệu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa tài liệu
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteDocument(id);
      // Xóa tài liệu khỏi state nếu thành công
      if (response.success) {
        setDocuments(prevDocuments => 
          prevDocuments.filter(doc => doc._id !== id)
        );
        if (currentDocument && currentDocument._id === id) {
          setCurrentDocument(null);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể xóa tài liệu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Chia sẻ tài liệu với người dùng khác
  const share = async (id: string, shareData: IShareDocument) => {
    setLoading(true);
    setError(null);
    try {
      const response = await shareDocument(id, shareData);
      // Cập nhật state nếu thành công
      if (response.success) {
        setDocuments(prevDocuments =>
          prevDocuments.map(doc =>
            doc._id === id ? response.data : doc
          )
        );
        if (currentDocument && currentDocument._id === id) {
          setCurrentDocument(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể chia sẻ tài liệu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Hủy chia sẻ tài liệu với người dùng
  const unshare = async (documentId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await unshareDocument(documentId, userId);
      // Cập nhật state nếu thành công
      if (response.success) {
        setDocuments(prevDocuments =>
          prevDocuments.map(doc =>
            doc._id === documentId ? response.data : doc
          )
        );
        if (currentDocument && currentDocument._id === documentId) {
          setCurrentDocument(response.data);
        }
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể hủy chia sẻ tài liệu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    currentDocument,
    loading,
    error,
    fetchDocuments,
    fetchDocumentById,
    upload,
    update,
    remove,
    share,
    unshare
  };
}; 