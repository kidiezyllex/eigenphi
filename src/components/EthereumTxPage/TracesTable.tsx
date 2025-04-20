import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { IconInfoCircle, IconMaximize } from '@tabler/icons-react'
import Icon from '@mdi/react'
import { mdiEthereum, mdiOpenInNew, mdiUnfoldMoreHorizontal } from '@mdi/js'
import Blockie from './Blockie'
import AddressLink from './AddressLink'
import CopyButton from './CopyButton'
import { Trace } from './types'
import { formatValue, isNullAddress } from './utils'
import { Pagination } from '@/components/ui/pagination'

interface TracesTableProps {
  traces: Trace[] | undefined
}

const TracesTable: React.FC<TracesTableProps> = ({ traces }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [sortedTraces, setSortedTraces] = useState<Trace[] | undefined>(traces)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 20 // 20 items per page

  useEffect(() => {
    setSortedTraces(traces)
  }, [traces])

  const handleSort = () => {
    if (!sortedTraces) return

    const newDirection = sortDirection === "asc" ? "desc" : "asc"
    setSortDirection(newDirection)

    const sorted = [...sortedTraces].sort((a, b) => {
      if (newDirection === "asc") {
        return a.eventLogIndex - b.eventLogIndex
      } else {
        return b.eventLogIndex - a.eventLogIndex
      }
    })

    setSortedTraces(sorted)
  }

  const getCurrentPageData = () => {
    if (!sortedTraces) return []
    const startIndex = (currentPage - 1) * pageSize
    return sortedTraces.slice(startIndex, startIndex + pageSize)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (!traces || traces.length === 0) {
    return (
      <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-bold text-white">Transfer List</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1">
                    <IconInfoCircle className="h-4 w-4 text-gray-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">Cannot find traces of this transaction.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="ghost" size="icon" className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7">
            <IconMaximize className="text-mainActiveV1 !h-4 !w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center">
          <p className="text-gray-400">Cannot find traces of this transaction.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-sm font-bold text-white">Transfer List</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1">
                  <IconInfoCircle className="h-4 w-4 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">Transfer Details</p>
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
                    <span>Hash</span>
                    <Icon path={mdiOpenInNew} size={0.7} />
                  </div>
                </th>
                <th className="py-2 px-4 text-right text-gray-400 text-xs font-medium">
                  <div className="flex items-center justify-end space-x-1">
                    <Icon path={mdiEthereum} size={0.7} />
                    <span>Amount</span>
                  </div>
                </th>
                <th className="py-2 px-4 text-left text-gray-400 text-xs font-medium">Asset</th>
                <th className="py-2 px-4 text-right text-gray-400 text-xs font-medium">
                  <button
                    className="flex items-center justify-end space-x-1 w-full cursor-pointer"
                    onClick={handleSort}
                  >
                    <span>Event Log Index</span>
                    <Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageData().map((trace, index) => (
                <React.Fragment key={index}>
                  <tr className="border-b border-mainBorderV1 hover:bg-mainCardV1/50">
                    <td className="py-3 px-4">
                      
                        <div className="flex items-center space-x-2">
                          <Blockie address={trace.from} size={18} />
                          <AddressLink address={trace.from} shorten={false} />
                          <CopyButton
                            text={trace.from}
                            copied={false}
                            onCopy={(text) => navigator.clipboard.writeText(text)}
                          />
                          <a
                            href={`/mev/ethereum/address/${trace.from}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-mainActiveV1"
                          >
                            <Icon path={mdiOpenInNew} size={0.7} />
                          </a>
                        </div>
                  
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-red-400">-{formatValue(trace.value)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Blockie address={trace.asset} size={18} />
                        <AddressLink address={trace.asset} isAsset={true} shorten={false} />
                        <CopyButton
                          text={trace.asset}
                          copied={false}
                          onCopy={(text) => navigator.clipboard.writeText(text)}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-white">{trace.eventLogIndex}</span>
                    </td>
                  </tr>

                  <tr className="border-b border-mainBorderV1 hover:bg-mainCardV1/50">
                    <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Blockie address={trace.to} size={18} />
                          <AddressLink address={trace.to} shorten={false} />
                          <CopyButton
                            text={trace.to}
                            copied={false}
                            onCopy={(text) => navigator.clipboard.writeText(text)}
                          />
                          <a
                            href={`/mev/ethereum/address/${trace.to}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-mainActiveV1"
                          >
                            <Icon path={mdiOpenInNew} size={0.7} />
                          </a>
                        </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-green-400">+{formatValue(trace.value)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Blockie address={trace.asset} size={18} />
                        <AddressLink address={trace.asset} isAsset={true} shorten={false} />
                        <CopyButton
                          text={trace.asset}
                          copied={false}
                          onCopy={(text) => navigator.clipboard.writeText(text)}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-white">{trace.eventLogIndex}</span>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full flex items-center justify-between mt-2">
          <div className="text-xs text-gray-400">
            <span>
              Total: {traces.length} traces ({traces.length * 2} rows)
            </span>
          </div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={traces.length}
            onChange={handlePageChange}
          />
        </div>
      </CardFooter>
    </Card>
  )
}

export default TracesTable 