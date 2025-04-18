import { getMevTransactionByHash } from '@/api/mev';
import { IMevTransactionResponse } from '@/interface/response/mev';
import { useQuery } from '@tanstack/react-query';

export const useGetMevTransactionByHash = (hash: string) => {
  return useQuery<IMevTransactionResponse, Error>({
    queryKey: ['mev', 'transaction', hash],
    queryFn: () => getMevTransactionByHash(hash),
    enabled: !!hash,
  });
}; 