"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface FlashloanProtocolsTableProps {
  data: Array<{
    id: string
    name: string
    totalAmount: number
    amountUSD: number
    transactions: number
    avgAmount: number
    marketShare: number
    change24h: number
    userCount: number
  }> | null
  isLoading: boolean
}

export function FlashloanProtocolsTable({ data, isLoading }: FlashloanProtocolsTableProps) {
  if (isLoading) {
    return (
      <div className="p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-4 py-3 border-b border-mainBorderV1">
            <Skeleton className="h-6 w-[20%]" />
            <Skeleton className="h-6 w-[25%]" />
            <Skeleton className="h-6 w-[15%]" />
            <Skeleton className="h-6 w-[10%]" />
            <Skeleton className="h-6 w-[10%]" />
            <Skeleton className="h-6 w-[10%]" />
            <Skeleton className="h-6 w-[10%]" />
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No protocol data available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-mainDarkBackgroundV2">
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Protocol</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Total Volume</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Volume (USD)</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Transactions</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Avg. Amount</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Market Share</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">24h Change</th>
            <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 tracking-wider">Users</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-mainBorderV1 hover:bg-mainDarkBackgroundV2">
              <td className="py-3 px-4 text-sm text-blue-400">{item.name}</td>
              <td className="py-3 px-4 text-sm text-white">{item.totalAmount.toLocaleString()} ETH</td>
              <td className="py-3 px-4 text-sm text-gray-300">${item.amountUSD.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm text-gray-300">{item.transactions.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm text-gray-300">{item.avgAmount.toFixed(2)} ETH</td>
              <td className="py-3 px-4 text-sm text-gray-300">{item.marketShare.toFixed(2)}%</td>
              <td className={`py-3 px-4 text-sm ${item.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
              </td>
              <td className="py-3 px-4 text-sm text-gray-300">{item.userCount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 