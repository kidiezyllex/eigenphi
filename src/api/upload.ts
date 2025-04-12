import { IUploadFile } from "@/interface/request/upload";
import {
  IUploadResponse,
  IDeleteFileResponse,
  IFileInfoResponse
} from "@/interface/response/upload";
import { sendGet, sendDelete } from "./axios";

/**
 * Upload file lên server
 * @param payload Dữ liệu để upload file
 */
export const uploadFile = async (
  payload: IUploadFile
): Promise<IUploadResponse> => {
  const formData = new FormData();
  
  // Thêm file vào form data
  formData.append("file", payload.file);
  
  // Thêm các thông tin khác
  formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  formData.append("category", payload.category);
  if (payload.project) formData.append("project", payload.project);
  if (payload.task) formData.append("task", payload.task);
  if (payload.version) formData.append("version", payload.version);
  
  // Xử lý tags
  if (payload.tags) {
    if (Array.isArray(payload.tags)) {
      formData.append("tags", payload.tags.join(","));
    } else {
      formData.append("tags", payload.tags);
    }
  }
  
  // Xử lý isShared
  if (payload.isShared !== undefined) {
    formData.append("isShared", String(payload.isShared));
  }
  
  // Xử lý sharedWith
  if (payload.sharedWith) {
    if (Array.isArray(payload.sharedWith)) {
      formData.append("sharedWith", payload.sharedWith.join(","));
    } else {
      formData.append("sharedWith", payload.sharedWith);
    }
  }
  
  // Gửi request với FormData
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    headers: {
      // Không được set Content-Type khi sử dụng FormData
      // Browser sẽ tự động thêm boundary cần thiết
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Có lỗi xảy ra khi upload file");
  }
  
  const data: IUploadResponse = await response.json();
  return data;
};

/**
 * Xóa file đã upload
 * @param id ID của document
 */
export const deleteFile = async (
  id: string
): Promise<IDeleteFileResponse> => {
  const res = await sendDelete(`/upload/${id}`);
  const data: IDeleteFileResponse = res;
  return data;
};

/**
 * Lấy thông tin file và URL để download
 * @param id ID của document
 */
export const getFileInfo = async (
  id: string
): Promise<IFileInfoResponse> => {
  const res = await sendGet(`/upload/${id}/info`);
  const data: IFileInfoResponse = res;
  return data;
};
