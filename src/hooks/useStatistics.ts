import { useQuery } from '@tanstack/react-query';
import {
  getOverviewStatistics,
  getUserStatistics,
  getProjectStatistics,
  getDocumentStatistics,
  getForumStatistics
} from '@/api/statistics';
import {
  IOverviewStatistics,
  IUserStatistics,
  IProjectStatistics,
  IDocumentStatistics,
  IForumStatistics
} from '@/interface/response/statistics';

export const useOverviewStatistics = () => {
  return useQuery<IOverviewStatistics, Error>({
    queryKey: ['statistics', 'overview'],
    queryFn: () => getOverviewStatistics(),
  });
};

export const useUserStatistics = () => {
  return useQuery<IUserStatistics, Error>({
    queryKey: ['statistics', 'users'],
    queryFn: () => getUserStatistics(),
  });
};

export const useProjectStatistics = () => {
  return useQuery<IProjectStatistics, Error>({
    queryKey: ['statistics', 'projects'],
    queryFn: () => getProjectStatistics(),
  });
};

export const useDocumentStatistics = () => {
  return useQuery<IDocumentStatistics, Error>({
    queryKey: ['statistics', 'documents'],
    queryFn: () => getDocumentStatistics(),
  });
};

export const useForumStatistics = () => {
  return useQuery<IForumStatistics, Error>({
    queryKey: ['statistics', 'forum'],
    queryFn: () => getForumStatistics(),
  });
}; 