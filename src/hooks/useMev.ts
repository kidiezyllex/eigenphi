import { getMevTransactionByHash, getMevBlockByNumber } from '@/api/mev';
import { IMevTransaction, IMevBlockResponse } from '@/interface/response/mev';
import { useQuery } from '@tanstack/react-query';

export const useGetMevTransactionByHash = (hash: string) => {
  return useQuery<IMevTransaction, Error>({
    queryKey: ['mev', 'transaction', hash],
    queryFn: () => getMevTransactionByHash(hash),
    enabled: !!hash,
  });
};

export const useGetMevBlockByNumber = (blockNumber: number) => {
  return useQuery<IMevBlockResponse, Error>({
    queryKey: ['mev', 'block', blockNumber],
    queryFn: () => getMevBlockByNumber(blockNumber),
    enabled: !!blockNumber,
  });
}; 