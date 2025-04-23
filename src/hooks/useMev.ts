import { getMevTransactionByHash, getMevBlockByNumber, getMevBlocks, getMevOverview, getMevLatest, getMevByAddress } from '@/api/mev';
import { IMevTransaction, IMevBlockResponse, IMevBlock, IMevOverview, IMevLatestResponse, IMevAddressResponse } from '@/interface/response/mev';
import { useQuery } from '@tanstack/react-query';

export const useGetMevTransactionByHash = (hash: string) => {
  return useQuery<IMevTransaction, Error>({
    queryKey: ['mev', 'transaction', hash],
    queryFn: () => getMevTransactionByHash(hash),
    retry: 1,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useGetMevBlockByNumber = (blockNumber: number) => {
  return useQuery<IMevBlockResponse, Error>({
    queryKey: ['mev', 'block', blockNumber],
    queryFn: () => getMevBlockByNumber(blockNumber),
    enabled: !!blockNumber,
  });
};

export const useGetMevOverview = () => {
  return useQuery<IMevOverview, Error>({
    queryKey: ['mev', 'overview'],
    queryFn: getMevOverview,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetMevLatest = () => {
  return useQuery<IMevLatestResponse, Error>({
    queryKey: ['mev', 'latest'],
    queryFn: getMevLatest,
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useGetMevByAddress = (address: string) => {
  return useQuery<IMevAddressResponse, Error>({
    queryKey: ['mev', 'address', address],
    queryFn: () => getMevByAddress(address),
    enabled: !!address, // Chỉ chạy query khi có address
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
