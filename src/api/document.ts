import {
  IUploadDocument,
  IUpdateDocument,
  IGetDocumentsParams,
  IShareDocument
} from "@/interface/request/document";
import {
  IDocumentResponse,
  IDocumentsListResponse,
  IDeleteDocumentResponse
} from "@/interface/response/document";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const uploadDocument = async (
  payload: IUploadDocument
): Promise<IDocumentResponse> => {
  const res = await sendPost("/documents", payload);
  const data: IDocumentResponse = res;
  return data;
};

export const getDocuments = async (
  params?: IGetDocumentsParams
): Promise<IDocumentsListResponse> => {
  const res = await sendGet("/documents", params);
  const data: IDocumentsListResponse = res;
  return data;
};

export const getDocumentById = async (
  id: string
): Promise<IDocumentResponse> => {
  const res = await sendGet(`/documents/${id}`);
  const data: IDocumentResponse = res;
  return data;
};

export const updateDocument = async (
  id: string,
  payload: IUpdateDocument
): Promise<IDocumentResponse> => {
  const res = await sendPut(`/documents/${id}`, payload);
  const data: IDocumentResponse = res;
  return data;
};

export const deleteDocument = async (
  id: string
): Promise<IDeleteDocumentResponse> => {
  const res = await sendDelete(`/documents/${id}`);
  const data: IDeleteDocumentResponse = res;
  return data;
};

export const shareDocument = async (
  id: string,
  payload: IShareDocument
): Promise<IDocumentResponse> => {
  const res = await sendPost(`/documents/${id}/share`, payload);
  const data: IDocumentResponse = res;
  return data;
};

export const unshareDocument = async (
  documentId: string,
  userId: string
): Promise<IDocumentResponse> => {
  const res = await sendDelete(`/documents/${documentId}/share/${userId}`);
  const data: IDocumentResponse = res;
  return data;
}; 