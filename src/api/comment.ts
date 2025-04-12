import {
  ICreateComment,
  IUpdateComment,
  IGetCommentsParams,
} from "@/interface/request/comment";
import {
  ICommentResponse,
  ICommentsListResponse,
  IDeleteCommentResponse,
} from "@/interface/response/comment";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const createComment = async (
  payload: ICreateComment
): Promise<ICommentResponse> => {
  const res = await sendPost("/comments", payload);
  const data: ICommentResponse = res;
  return data;
};

export const getComments = async (
  params?: IGetCommentsParams
): Promise<ICommentsListResponse> => {
  const res = await sendGet("/comments", params);
  const data: ICommentsListResponse = res;
  return data;
};

export const updateComment = async (
  id: string,
  payload: IUpdateComment
): Promise<ICommentResponse> => {
  const res = await sendPut(`/comments/${id}`, payload);
  const data: ICommentResponse = res;
  return data;
};

export const deleteComment = async (
  id: string
): Promise<IDeleteCommentResponse> => {
  const res = await sendDelete(`/comments/${id}`);
  const data: IDeleteCommentResponse = res;
  return data;
}; 