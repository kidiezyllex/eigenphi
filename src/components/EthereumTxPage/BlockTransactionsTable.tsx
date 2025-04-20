import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { IconInfoCircle, IconMaximize } from '@tabler/icons-react'
import Icon from '@mdi/react'
import { mdiEthereum, mdiOpenInNew } from '@mdi/js'
import Blockie from './Blockie'
import AddressLink from './AddressLink'
import TransactionLink from './TransactionLink'
import { IMevBlockTransaction } from '@/interface/response/mev'
import { Pagination } from '@/components/ui/pagination'

interface BlockTransactionsTableProps {
  transactions: IMevBlockTransaction[] | undefined
}

const BlockTransactionsTable: React.FC<BlockTransactionsTableProps> = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 50 // 50 transactions per page

  const getCurrentPageData = () => {
    if (!transactions) return []
    const startIndex = (currentPage - 1) * pageSize
    return transactions.slice(startIndex, startIndex + pageSize)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-bold text-white">Block Transactions</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1">
                    <IconInfoCircle className="h-4 w-4 text-gray-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">Transactions in this block.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="ghost" size="icon" className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7">
            <IconMaximize className="text-mainActiveV1 !h-4 !w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center">
          <p className="text-gray-400">No transactions found in this block.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-sm font-bold text-white">Block Transactions</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1">
                  <IconInfoCircle className="h-4 w-4 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">Transactions in this block.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button variant="ghost" size="icon" className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7">
          <IconMaximize className="text-mainActiveV1 !h-4 !w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-mainCardV1">
              <tr>
                <th className="py-2 px-4 text-left text-gray-400 text-xs font-medium">
                  <div className="flex items-center space-x-1">
                    <Icon path={mdiEthereum} size={0.7} />
                    <span>Tx Hash</span>
                  </div>
                </th>
                <th className="py-2 px-4 text-left text-gray-400 text-xs font-medium">Block</th>
                <th className="py-2 px-4 text-left text-gray-400 text-xs font-medium">From</th>
                <th className="py-2 px-4 text-left text-gray-400 text-xs font-medium">To</th>
                <th className="py-2 px-4 text-right text-gray-400 text-xs font-medium">Gas Price</th>
                <th className="py-2 px-4 text-right text-gray-400 text-xs font-medium">Gas Used</th>
                <th className="py-2 px-4 text-center text-gray-400 text-xs font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageData().map((tx, index) => (
                <tr key={index} className="border-b border-mainBorderV1 hover:bg-mainCardV1/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <TransactionLink hash={tx.hash} shorten={true} />
                      <a
                        href={`/mev/ethereum/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-mainActiveV1"
                      >
                        <Icon path={mdiOpenInNew} size={0.7} />
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-white">{tx.blockNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Blockie address={tx.from} size={18} />
                      <AddressLink address={tx.from} shorten={true} />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Blockie address={tx.to} size={18} />
                      <AddressLink address={tx.to} shorten={true} />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-white">{tx.gasPrice}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-white">{tx.gasUsed}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {tx.label ? (
                      <span className="inline-block px-2 py-1 bg-mainActiveV1/20 text-mainActiveV1 rounded-md text-xs">
                        {tx.label}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-gray-500/20 text-gray-400 rounded-md text-xs">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full flex items-center justify-between mt-2">
          <div className="text-xs text-gray-400">
            <span>
              Total: {transactions.length} transactions
            </span>
          </div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={transactions.length}
            onChange={handlePageChange}
          />
        </div>
      </CardFooter>
    </Card>
  )
}

export default BlockTransactionsTable 