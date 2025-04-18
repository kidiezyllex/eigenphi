export interface TransactionSummaryData {
  mevType: string
  time: string
  transactionHash: string
  from: string
  contractTo: string
  profit: string
  cost: string
  revenue: string
  blockNumber: number
  position: number
  gasPrice?: string
  gasUsed?: string
  timestamp?: string
}

export interface TokenAmount {
  token: string
  amount: number
}

export interface TokenTransfer {
  address: string
  name?: string
  protocol?: string
  amounts: TokenAmount[]
  type?: "revenue" | "cost" | "profit" | "normal"
}

export interface Trace {
  from: string
  to: string
  asset: string
  value: string
  eventLogIndex: number
} 