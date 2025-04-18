"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IconClock, IconInfoCircle, IconMaximize } from "@tabler/icons-react"
import { useGetMevTransactionByHash } from "@/hooks/useMev"
import { useParams } from "next/navigation"
import Icon from "@mdi/react"
import { mdiOpenInNew, mdiUnfoldMoreHorizontal, mdiEthereum } from "@mdi/js"

interface TransactionSummaryData {
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

interface Trace {
  from: string
  to: string
  asset: string
  value: string
  eventLogIndex: number
}

// Hiển thị địa chỉ "0x0000..." dưới dạng đặc biệt
const isNullAddress = (address: string) => {
  return address === "0x0000000000000000000000000000000000000000"
}

function Blockie({ address, size = 24 }: { address: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple hash function for demo purposes
    const hash = (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash = hash & hash
      }
      return Math.abs(hash)
    }

    const addressHash = hash(address)

    // Generate a color based on the hash
    const r = addressHash % 255
    const g = (addressHash * 7) % 255
    const b = (addressHash * 13) % 255

    // Fill the canvas with the color
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(0, 0, size, size)

    // Add some patterns
    const patternSize = Math.floor(size / 3)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if ((i + j) % 2 === 0) {
          const shade = (r + g + b) / 3 > 128 ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"
          ctx.fillStyle = shade
          ctx.fillRect(i * patternSize, j * patternSize, patternSize, patternSize)
        }
      }
    }
  }, [address, size])

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-full" />
}

function SocialButton({ icon }: { icon: string }) {
  const getIconColor = () => {
    switch (icon) {
      case "twitter":
        return "#00aced"
      case "telegram":
        return "#37aee2"
      case "reddit":
        return "#ff4500"
      default:
        return "#000000"
    }
  }

  return (
    <button className="p-1 rounded-full hover:bg-accent/50" aria-label={icon}>
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center"
        style={{ backgroundColor: getIconColor() }}
      >
        <i className={`iconfont icon-${icon}`} style={{ fontSize: "10px", color: "white" }} />
      </div>
    </button>
  )
}

function CopyButton({
  text,
  copied,
  onCopy,
}: {
  text: string
  copied: boolean
  onCopy: (text: string) => void
}) {
  return (
    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCopy(text)}>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-3 w-3 text-green-500" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-3 w-3 text-mainGrayV1" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

function AddressLink({ address, isAsset = false }: { address: string; isAsset?: boolean }) {
  const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

  return (
    <a
      href={`https://etherscan.io/${isAsset ? "token" : "address"}/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#4DC3E2] hover:underline text-sm"
    >
      {shortAddress}
    </a>
  )
}

function formatValue(value: string): string {
  // Kiểm tra xem value có phải là số rất lớn không
  if (value.length > 10) {
    // Nếu là số rất lớn, chia cho 10^18 để chuyển từ wei sang ETH
    const num = BigInt(value)
    const divisor = BigInt(10 ** 18)
    const whole = num / divisor
    const fraction = num % divisor

    // Định dạng phần thập phân để có 6 chữ số phần thập phân
    const fractionalPart = fraction.toString().padStart(18, "0").substring(0, 6)
    return `${whole.toString()}.${fractionalPart}`
  }

  // Nếu là số nhỏ hơn, giữ nguyên
  return value
}

function TraceRow({ trace, expandedView = false }: { trace: Trace; expandedView?: boolean }) {
  const [copiedFrom, setCopiedFrom] = useState(false)
  const [copiedTo, setCopiedTo] = useState(false)
  const [copiedAsset, setCopiedAsset] = useState(false)

  const handleCopy = (text: string, type: "from" | "to" | "asset") => {
    navigator.clipboard.writeText(text)
    if (type === "from") {
      setCopiedFrom(true)
      setTimeout(() => setCopiedFrom(false), 2000)
    } else if (type === "to") {
      setCopiedTo(true)
      setTimeout(() => setCopiedTo(false), 2000)
    } else {
      setCopiedAsset(true)
      setTimeout(() => setCopiedAsset(false), 2000)
    }
  }

  const renderAddressCell = (address: string, isFrom: boolean) => (
    <div className="flex items-center space-x-2">
      {isNullAddress(address) ? (
        <span className="text-gray-400 text-sm">Null Address</span>
      ) : (
        <>
          <Blockie address={address} size={18} />
          <AddressLink address={address} />
          <CopyButton
            text={address}
            copied={isFrom ? copiedFrom : copiedTo}
            onCopy={(text) => handleCopy(text, isFrom ? "from" : "to")}
          />
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-mainActiveV1"
          >
            <Icon path={mdiOpenInNew} size={0.7} />
          </a>
        </>
      )}
    </div>
  )

  const renderAssetCell = (asset: string) => (
    <div className="flex items-center space-x-2">
      <Blockie address={asset} size={18} />
      <AddressLink address={asset} isAsset={true} />
      <CopyButton text={asset} copied={copiedAsset} onCopy={(text) => handleCopy(text, "asset")} />
    </div>
  )

  if (expandedView) {
    return (
      <>
        <tr className="border-b border-mainBorderV1">
          <td className="py-3 px-4">{renderAddressCell(trace.from, true)}</td>
          <td className="py-3 px-4 text-right">
            <span className="text-sm text-red-400">-{formatValue(trace.value)}</span>
          </td>
          <td className="py-3 px-4">{renderAssetCell(trace.asset)}</td>
          <td className="py-3 px-4 text-right">
            <span className="text-sm text-white">{trace.eventLogIndex}</span>
          </td>
        </tr>
        <tr className="border-b border-mainBorderV1">
          <td className="py-3 px-4">{renderAddressCell(trace.to, false)}</td>
          <td className="py-3 px-4 text-right">
            <span className="text-sm text-green-400">+{formatValue(trace.value)}</span>
          </td>
          <td className="py-3 px-4">{renderAssetCell(trace.asset)}</td>
          <td className="py-3 px-4 text-right">
            <span className="text-sm text-white">{trace.eventLogIndex}</span>
          </td>
        </tr>
      </>
    )
  }

  return (
    <tr className="border-b border-mainBorderV1">
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          {isNullAddress(trace.from) ? (
            <span className="text-gray-400 text-sm">Null Address</span>
          ) : (
            <>
              <Blockie address={trace.from} size={18} />
              <AddressLink address={trace.from} />
              <CopyButton text={trace.from} copied={copiedFrom} onCopy={(text) => handleCopy(text, "from")} />
            </>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          {isNullAddress(trace.to) ? (
            <span className="text-gray-400 text-sm">Null Address</span>
          ) : (
            <>
              <Blockie address={trace.to} size={18} />
              <AddressLink address={trace.to} />
              <CopyButton text={trace.to} copied={copiedTo} onCopy={(text) => handleCopy(text, "to")} />
            </>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          <Blockie address={trace.asset} size={18} />
          <AddressLink address={trace.asset} isAsset={true} />
          <CopyButton text={trace.asset} copied={copiedAsset} onCopy={(text) => handleCopy(text, "asset")} />
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm text-white">{formatValue(trace.value)}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm text-white">{trace.eventLogIndex}</span>
      </td>
    </tr>
  )
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-mainBackgroundV1 border border-mainBorderV1 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <th key={i} className="text-left">
                      <Skeleton className="h-5 w-24" />
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <td key={j} className="py-2">
                          <Skeleton className="h-5 w-full" />
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function TracesTable({ traces }: { traces: Trace[] | undefined }) {
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
            <CardTitle className="text-sm font-bold text-white">Transfer List
</CardTitle>
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
          <CardTitle className="text-sm font-bold text-white">Transfer List
</CardTitle>
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

export default function EigenTxPage() {
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams<{ hash: string }>()
  const hash = params.hash || ""
  const { data: apiResponse } = useGetMevTransactionByHash(hash)

  const getTransactionType = (label: string | null | undefined) => {
    if (!label) return "Không"

    switch (label.toUpperCase()) {
      case "ARBITRAGE":
        return "Arbitrage"
      case "SANDWICH":
        return "Sandwich"
      case "LIQUIDATION":
        return "Liquidation"
      default:
        return "Không"
    }
  }

  const transactionType = getTransactionType(apiResponse?.label)

  // Prepare transaction data from API response
  const transactionData = {
    summary: apiResponse
      ? {
          mevType: apiResponse.label || "Giao dịch",
          time: apiResponse.time || apiResponse.timestamp || "",
          transactionHash: apiResponse.hash || "",
          from: apiResponse.from || "",
          contractTo: apiResponse.to || "",
          profit: apiResponse.profit || "0",
          cost: apiResponse.cost || "0",
          revenue: (() => {
            // Kiểm tra và sửa lỗi định dạng số trong revenue
            if (!apiResponse.revenue) return "0"
            if (apiResponse.revenue.includes(apiResponse.profit || "") && apiResponse.profit) {
              return apiResponse.profit
            }
            return apiResponse.revenue
          })(),
          blockNumber: apiResponse.blockNumber || 0,
          position: apiResponse.index || 0,
          gasPrice: apiResponse.gasPrice,
          gasUsed: apiResponse.gasUsed,
          timestamp: apiResponse.timestamp,
        }
      : {
          mevType: "Giao dịch",
          time: "",
          transactionHash: "",
          from: "",
          contractTo: "",
          profit: "0",
          cost: "0",
          revenue: "0",
          blockNumber: 0,
          position: 0,
        },
  }

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-mainDarkBackgroundV1 text-white pl-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col space-y-4">

          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <TracesTable traces={apiResponse?.traces} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
