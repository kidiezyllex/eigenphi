import {
  ICreateForumPost,
  IUpdateForumPost,
  IGetForumPostsParams
} from "@/interface/request/forumPost";
import {
  IForumPostResponse,
  IForumPostsListResponse,
  IDeleteForumPostResponse
} from "@/interface/response/forumPost";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const createForumPost = async (
  payload: ICreateForumPost
): Promise<IForumPostResponse> => {
  const res = await sendPost("/forum-posts", payload);
  const data: IForumPostResponse = res;
  return data;
};

export const getForumPosts = async (
  params?: IGetForumPostsParams
): Promise<IForumPostsListResponse> => {
  const res = await sendGet("/forum-posts", params);
  const data: IForumPostsListResponse = res;
  return data;
};

export const getForumPostById = async (
  id: string
): Promise<IForumPostResponse> => {
  const res = await sendGet(`/forum-posts/${id}`);
  const data: IForumPostResponse = res;
  return data;
};

export const updateForumPost = async (
  id: string,
  payload: IUpdateForumPost
): Promise<IForumPostResponse> => {
  const res = await sendPut(`/forum-posts/${id}`, payload);
  const data: IForumPostResponse = res;
  return data;
};

export const deleteForumPost = async (
  id: string
): Promise<IDeleteForumPostResponse> => {
  const res = await sendDelete(`/forum-posts/${id}`);
  const data: IDeleteForumPostResponse = res;
  return data;
}; 