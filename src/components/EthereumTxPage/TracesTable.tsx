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

interface TracesTableProps {
  traces: Trace[] | undefined
}

const TracesTable: React.FC<TracesTableProps> = ({ traces }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [sortedTraces, setSortedTraces] = useState<Trace[] | undefined>(traces)

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
                  <p className="w-[200px] text-xs">Không có dữ liệu traces cho giao dịch này</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="ghost" size="icon" className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7">
            <IconMaximize className="text-mainActiveV1 !h-4 !w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center">
          <p className="text-gray-400">Không có dữ liệu traces cho giao dịch này</p>
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
                <p className="w-[200px] text-xs">Thông tin chi tiết về các token transfer trong giao dịch</p>
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
                    <span>ETH</span>
                  </div>
                </th>
                <th className="py-2 px-4 text-left text-gray-400 text-xs font-medium">Asset</th>
                <th className="py-2 px-4 text-right text-gray-400 text-xs font-medium">
                  <button
                    className="flex items-center justify-end space-x-1 w-full cursor-pointer"
                    onClick={handleSort}
                  >
                    <span>EventLogIndex</span>
                    <Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTraces?.map((trace, index) => (
                <React.Fragment key={index}>
                  {/* Dòng "from" */}
                  <tr className="border-b border-mainBorderV1 hover:bg-mainCardV1/50">
                    <td className="py-3 px-4">
                      {isNullAddress(trace.from) ? (
                        <span className="text-gray-400 text-sm">Null Address</span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Blockie address={trace.from} size={18} />
                          <AddressLink address={trace.from} />
                          <CopyButton
                            text={trace.from}
                            copied={false}
                            onCopy={(text) => navigator.clipboard.writeText(text)}
                          />
                          <a
                            href={`https://etherscan.io/address/${trace.from}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-mainActiveV1"
                          >
                            <Icon path={mdiOpenInNew} size={0.7} />
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-red-400">-{formatValue(trace.value)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Blockie address={trace.asset} size={18} />
                        <AddressLink address={trace.asset} isAsset={true} />
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

                  {/* Dòng "to" */}
                  <tr className="border-b border-mainBorderV1 hover:bg-mainCardV1/50">
                    <td className="py-3 px-4">
                      {isNullAddress(trace.to) ? (
                        <span className="text-gray-400 text-sm">Null Address</span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Blockie address={trace.to} size={18} />
                          <AddressLink address={trace.to} />
                          <CopyButton
                            text={trace.to}
                            copied={false}
                            onCopy={(text) => navigator.clipboard.writeText(text)}
                          />
                          <a
                            href={`https://etherscan.io/address/${trace.to}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-mainActiveV1"
                          >
                            <Icon path={mdiOpenInNew} size={0.7} />
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-green-400">+{formatValue(trace.value)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Blockie address={trace.asset} size={18} />
                        <AddressLink address={trace.asset} isAsset={true} />
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
        <div className="flex items-center justify-start mt-2 text-xs text-gray-400">
          <span>
            Tổng số: {traces.length} traces ({traces.length * 2} dòng)
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default TracesTable 