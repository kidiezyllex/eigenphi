interface IMevTrace {
  from: string;
  to: string;
  asset: string;
  value: string;
  eventLogIndex: number;
}

// Thông tin cho 1 block
export interface IMevBlock {
  hash: string;
  number: number;
  timestamp: string;
}

// Thông tin cho transaction trong block
export interface IMevBlockTransaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  gasPrice: string;
  gasUsed: string;
  timestamp: string;
  label: string | null;
  index: number;
}

// Response cho API /mev/block/{block_number}
export interface IMevBlockResponse {
  block: IMevBlock;
  transactions: IMevBlockTransaction[];
}

export interface IMevTransaction {
  label: string | null;
  time?: string;
  hash: string;
  from: string;
  to: string;
  profit?: string;
  cost?: string;
  revenue?: string;
  blockNumber: number;
  index: number;
  traces?: IMevTrace[];
  frontRun?: IMevTrace[];
  backRun?: IMevTrace[];
  victim?: IMevTrace[];
  gasUsed?: string;
  gasPrice?: string;
  timestamp?: string;
}