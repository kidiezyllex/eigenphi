interface IMevTrace {
  from: string;
  to: string;
  asset: string;
  value: string;
  eventLogIndex: number;
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
  gasUsed?: string;
  gasPrice?: string;
  timestamp?: string;
}