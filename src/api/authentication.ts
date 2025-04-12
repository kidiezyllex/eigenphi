import {
  ISignIn,
  IRegister,
  IUpdateUser,
  IChangePassword,
} from "@/interface/request/authentication";
import {
  IAuthResponse,
  IProfileResponse,
} from "@/interface/response/authentication";
import { sendGet, sendPost, sendPut } from "./axios";

export const register = async (payload: IRegister): Promise<IAuthResponse> => {
  const res = await sendPost("/auth/register", payload);
  const data: IAuthResponse = res;
  return data;
};

export const signIn = async (payload: ISignIn): Promise<IAuthResponse> => {
  const res = await sendPost("/auth/login", payload);
  const data: IAuthResponse = res;
  return data;
};

export const getProfile = async (): Promise<IProfileResponse> => {
  const res = await sendGet("/auth/profile");
  const data: IProfileResponse = res;
  return data;
};
