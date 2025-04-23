import { IMevTransaction, IMevBlockResponse, IMevBlock, IMevOverview, IMevLatestResponse, IMevAddressResponse } from "@/interface/response/mev";
import { sendGet } from "./axios";

export const getMevTransactionByHash = async (
  hash: string
): Promise<IMevTransaction> => {
  const res = await sendGet(`/mev/tx/${hash}`);
  return res;
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

export const getMevOverview = async (): Promise<IMevOverview> => {
  const res = await sendGet(`/mev/overview/`);
  return res;
};

export const getMevLatest = async (): Promise<IMevLatestResponse> => {
  const res = await sendGet(`/mev/latest/`);
  return res;
};

export const getMevByAddress = async (
  address: string
): Promise<IMevAddressResponse> => {
  const res = await sendGet(`/address/${address}`);
  return res;
}; 