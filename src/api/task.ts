import {
  ICreateTask,
  IUpdateTask,
  IGetTasksParams
} from "@/interface/request/task";
import {
  ITaskResponse,
  ITasksListResponse,
  IDeleteTaskResponse
} from "@/interface/response/task";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const createTask = async (
  payload: ICreateTask
): Promise<ITaskResponse> => {
  const res = await sendPost("/tasks", payload);
  const data: ITaskResponse = res;
  return data;
};

export const getTasks = async (
  params?: IGetTasksParams
): Promise<ITasksListResponse> => {
  const res = await sendGet("/tasks", params);
  const data: ITasksListResponse = res;
  return data;
};

export const getTaskById = async (
  id: string
): Promise<ITaskResponse> => {
  const res = await sendGet(`/tasks/${id}`);
  const data: ITaskResponse = res;
  return data;
};

export const updateTask = async (
  id: string,
  payload: IUpdateTask
): Promise<ITaskResponse> => {
  const res = await sendPut(`/tasks/${id}`, payload);
  const data: ITaskResponse = res;
  return data;
};

export const deleteTask = async (
  id: string
): Promise<IDeleteTaskResponse> => {
  const res = await sendDelete(`/tasks/${id}`);
  const data: IDeleteTaskResponse = res;
  return data;
}; 