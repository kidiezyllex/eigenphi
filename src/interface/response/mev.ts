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
  id: string;
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

// Response cho API /mev/overview/
export interface IMevOverview {
  // Giả định cấu trúc dữ liệu dựa trên tên "aggregated overview"
  totalMevTransactions: number;
  totalProfit: string; // Sử dụng string để tránh vấn đề độ chính xác của number lớn
  // Thêm các trường khác nếu cần
}

// Response cho API /mev/latest/
// Giả định API này trả về một danh sách các transaction tương tự như IMevTransaction
export type IMevLatestResponse = IMevTransaction[];

// Response cho API /address/{address}
// Giả định API này trả về một danh sách các transaction liên quan đến địa chỉ
export type IMevAddressResponse = IMevTransaction[];