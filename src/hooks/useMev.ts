import { getMevTransactionByHash, getMevBlockByNumber, getMevBlocks } from '@/api/mev';
import { IMevTransaction, IMevBlockResponse, IMevBlock } from '@/interface/response/mev';
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
