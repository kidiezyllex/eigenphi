import { sendGet } from "./axios";

export const getOverviewStatistics = async () => {
  const response = await sendGet(`/statistics`);
  return response;
};

export const getUserStatistics = async () => {
  const response = await sendGet(`/statistics/users`);
  return response;
};

export const getProjectStatistics = async () => {
  const response = await sendGet(`/statistics/projects`);
  return response;
};

export const getDocumentStatistics = async () => {
  const response = await sendGet(`/statistics/documents`);
  return response;
};

export const getForumStatistics = async () => {
  const response = await sendGet(`/statistics/forum`);
  return response;
}; 