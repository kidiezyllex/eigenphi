import { IUpdateUser } from "@/interface/request/user";
import {
  IUserResponse,
  IUsersListResponse,
  IDeleteUserResponse
} from "@/interface/response/user";
import { sendGet, sendPut, sendDelete } from "./axios";

export const getUsers = async (): Promise<IUsersListResponse> => {
  const res = await sendGet("/users");
  const data: IUsersListResponse = res;
  return data;
};

export const getUserById = async (
  id: string
): Promise<IUserResponse> => {
  const res = await sendGet(`/users/${id}`);
  const data: IUserResponse = res;
  return data;
};

export const updateUser = async (
  id: string,
  userData: IUpdateUser
): Promise<IUserResponse> => {
  const res = await sendPut(`/users/${id}`, userData);
  const data: IUserResponse = res;
  return data;
};

export const deleteUser = async (
  id: string
): Promise<IDeleteUserResponse> => {
  const res = await sendDelete(`/users/${id}`);
  const data: IDeleteUserResponse = res;
  return data;
}; 