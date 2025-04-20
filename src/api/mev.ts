import { IMevTransaction, IMevBlockResponse, IMevBlock } from "@/interface/response/mev";
import { sendGet } from "./axios";

export const getMevTransactionByHash = async (
  hash: string
): Promise<IMevTransaction> => {
  const res = await sendGet(`/mev/tx/${hash}`);
  const data: IMevTransaction = res;
  return data;
};

export const getMevBlockByNumber = async (
  blockNumber: number
): Promise<IMevBlockResponse> => {
  const res = await sendGet(`/mev/block/${blockNumber}`);
  const data: IMevBlockResponse = res;
  return data;
};

export const getMevBlocks = async (
  blockNumber: number
): Promise<IMevBlockResponse> => {
  const res = await sendGet(`/mev/block/${blockNumber}`);
  return res;
}; 