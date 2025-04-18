import { IMevTransaction } from "@/interface/response/mev";
import { sendGet } from "./axios";

export const getMevTransactionByHash = async (
  hash: string
): Promise<IMevTransaction> => {
  const res = await sendGet(`/mev/tx/${hash}`);
  const data: IMevTransaction = res;
  return data;
}; 