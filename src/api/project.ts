import {
  ICreateProject,
  IUpdateProject,
  IAddProjectMember
} from "@/interface/request/project";
import {
  IProjectResponse,
  IProjectsListResponse,
  IDeleteProjectResponse
} from "@/interface/response/project";
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

export const createProject = async (
  payload: ICreateProject
): Promise<IProjectResponse> => {
  const res = await sendPost("/projects", payload);
  const data: IProjectResponse = res;
  return data;
};

export const getProjects = async (): Promise<IProjectsListResponse> => {
  const res = await sendGet("/projects");
  const data: IProjectsListResponse = res;
  return data;
};

export const getProjectById = async (
  id: string
): Promise<IProjectResponse> => {
  const res = await sendGet(`/projects/${id}`);
  const data: IProjectResponse = res;
  return data;
};

export const updateProject = async (
  id: string,
  payload: IUpdateProject
): Promise<IProjectResponse> => {
  const res = await sendPut(`/projects/${id}`, payload);
  const data: IProjectResponse = res;
  return data;
};

export const deleteProject = async (
  id: string
): Promise<IDeleteProjectResponse> => {
  const res = await sendDelete(`/projects/${id}`);
  const data: IDeleteProjectResponse = res;
  return data;
};

export const addProjectMember = async (
  projectId: string,
  payload: IAddProjectMember
): Promise<IProjectResponse> => {
  const res = await sendPost(`/projects/${projectId}/members`, payload);
  const data: IProjectResponse = res;
  return data;
};

export const removeProjectMember = async (
  projectId: string,
  userId: string
): Promise<IProjectResponse> => {
  const res = await sendDelete(`/projects/${projectId}/members/${userId}`);
  const data: IProjectResponse = res;
  return data;
}; 