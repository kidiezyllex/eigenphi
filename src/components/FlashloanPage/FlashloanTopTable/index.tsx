"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface FlashloanTopTableProps {
  data: Array<{
    id: string
    rank: number
    timestamp: string
    protocol: string
    amount: number
    amountUSD: number
    tokens: string
    fee: number
    user: string
    txHash: string
  }> | null
  isLoading: boolean
}

export function FlashloanTopTable({ data, isLoading }: FlashloanTopTableProps) {
  // Helper để rút gọn địa chỉ
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Định dạng timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-4 py-3 border-b border-mainBorderV1">
            <Skeleton className="h-6 w-[10%]" />
            <Skeleton className="h-6 w-[15%]" />
            <Skeleton className="h-6 w-[10%]" />
            <Skeleton className="h-6 w-[15%]" />
            <Skeleton className="h-6 w-[20%]" />
            <Skeleton className="h-6 w-[15%]" />
            <Skeleton className="h-6 w-[15%]" />
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No flashloan data available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-mainDarkBackgroundV2">
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">#</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Time</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Protocol</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Token</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Amount</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Amount (USD)</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">User</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">TX Hash</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-mainBorderV1 hover:bg-mainDarkBackgroundV2">
              <td className="py-3 px-4 text-sm text-white">{item.rank}</td>
              <td className="py-3 px-4 text-sm text-gray-300">{formatTimestamp(item.timestamp)}</td>
              <td className="py-3 px-4 text-sm text-blue-400">{item.protocol}</td>
              <td className="py-3 px-4 text-sm text-gray-300">{item.tokens}</td>
              <td className="py-3 px-4 text-sm text-white">{item.amount.toLocaleString()} ETH</td>
              <td className="py-3 px-4 text-sm text-gray-300">${item.amountUSD.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm text-blue-400">
                <a href={`/mev/ethereum/address/${item.user}`} target="_blank" rel="noopener noreferrer">
                  {shortenAddress(item.user)}
                </a>
              </td>
              <td className="py-3 px-4 text-sm text-blue-400">
                <a href={`/mev/ethereum/tx/${item.txHash}`} target="_blank" rel="noopener noreferrer">
                  {shortenAddress(item.txHash)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 