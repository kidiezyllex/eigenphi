export interface IGetMevTxParams {
  hash: string;
}

export interface IGetMevBlockParams {
  blockNumber: number;
}

export interface IGetMevBlocksParams {
  page?: number;
  limit?: number;
}

export interface IGetMevByAddressParams {
  address: string;
} 