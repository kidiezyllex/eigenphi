import { IUploadFile, IFileInfo } from "@/interface/request/upload";
import {
  IUploadResponse,
  IDeleteFileResponse,
  IFileInfoResponse
} from "@/interface/response/upload";
import { sendGet, sendPost, sendDelete } from "./axios";

export const uploadFile = async (
  payload: FormData
): Promise<IUploadResponse> => {
  const res = await sendPost("/upload", payload);
  const data: IUploadResponse = res;
  return data;
};

export const getFileInfo = async (
  id: string
): Promise<IFileInfoResponse> => {
  const res = await sendGet(`/upload/${id}/info`);
  const data: IFileInfoResponse = res;
  return data;
};

export const deleteFile = async (
  id: string
): Promise<IDeleteFileResponse> => {
  const res = await sendDelete(`/upload/${id}`);
  const data: IDeleteFileResponse = res;
  return data;
};
