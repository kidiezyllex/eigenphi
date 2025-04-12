import {
  ICreateDocumentCategory,
  IUpdateDocumentCategory
} from "@/interface/request/documentCategory";
import {
  IDocumentCategoryResponse,
  IDocumentCategoriesListResponse,
  IDeleteDocumentCategoryResponse
} from "@/interface/response/documentCategory";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const createDocumentCategory = async (
  payload: ICreateDocumentCategory
): Promise<IDocumentCategoryResponse> => {
  const res = await sendPost("/document-categories", payload);
  const data: IDocumentCategoryResponse = res;
  return data;
};

export const getDocumentCategories = async (): Promise<IDocumentCategoriesListResponse> => {
  const res = await sendGet("/document-categories");
  const data: IDocumentCategoriesListResponse = res;
  return data;
};

export const getDocumentCategoryById = async (
  id: string
): Promise<IDocumentCategoryResponse> => {
  const res = await sendGet(`/document-categories/${id}`);
  const data: IDocumentCategoryResponse = res;
  return data;
};

export const updateDocumentCategory = async (
  id: string,
  payload: IUpdateDocumentCategory
): Promise<IDocumentCategoryResponse> => {
  const res = await sendPut(`/document-categories/${id}`, payload);
  const data: IDocumentCategoryResponse = res;
  return data;
};

export const deleteDocumentCategory = async (
  id: string
): Promise<IDeleteDocumentCategoryResponse> => {
  const res = await sendDelete(`/document-categories/${id}`);
  const data: IDeleteDocumentCategoryResponse = res;
  return data;
}; 