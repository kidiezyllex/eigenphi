"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Info, Check } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { IconClock, IconInfoCircle, IconMaximize } from "@tabler/icons-react"
import { useGetMevTransactionByHash } from "@/hooks/useMev"
import { useParams } from "next/navigation"

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

interface TokenAmount {
  token: string
  amount: number
}

interface TokenTransfer {
  address: string
  name?: string
  protocol?: string
  amounts: TokenAmount[]
  type?: "revenue" | "cost" | "profit" | "normal"
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

function AddressLink({ address, isHash = false }: { address: string; isHash?: boolean }) {
  const shortAddress = isHash
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

  return (
    <a
      href={`https://etherscan.io/${isHash ? "tx" : "address"}/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#4DC3E2] hover:underline text-sm"
    >
      {shortAddress}
    </a>
  )
}

function SummaryRow({ label, value, isLast }: { label: string; value: any; isLast: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatLabel = (label: string) => {
    // Translate labels to English
    const translations: Record<string, string> = {
      "mevType": "MEV Type",
      "time": "Time",
      "transactionHash": "Transaction Hash",
      "from": "From",
      "contractTo": "To",
      "profit": "Profit",
      "cost": "Cost",
      "revenue": "Revenue",
      "blockNumber": "Block Number",
      "position": "Position",
      "gasPrice": "Gas Price",
      "gasUsed": "Gas Used",
      "timestamp": "Timestamp"
    };
    
    const englishLabel = translations[label] || label.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    return englishLabel;
  }

  const formatNumericValue = (value: any, label: string) => {
    // Đối với các giá trị profit, cost, revenue - format dạng số tiền
    if (["profit", "cost", "revenue"].includes(label.toLowerCase())) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return `${num.toFixed(6)} ETH`;
      }
    }
    
    // Format giá gas
    if (label.toLowerCase() === "gasprice" && value) {
      const gwei = parseFloat(value) / 1e9;
      return `${gwei.toFixed(2)} Gwei`;
    }
    
    return value;
  }

  const isAddress = typeof value === "string" && value.startsWith("0x") && value.length > 40
  const isHash = typeof value === "string" && value.startsWith("0x") && value.length > 60
  const isNumber = typeof value === "number" || !isNaN(Number(value))

  // Nếu giá trị undefined hoặc null, không hiển thị hàng
  if (value === undefined || value === null) {
    return null;
  }

  return (
    <tr className={!isLast ? "border-b border-mainBorderV1" : ""}>
      <td className="py-3 px-4 w-1/4">
        <div className="flex items-center space-x-1 text-gray-400 text-sm">
          <span>{formatLabel(label)}</span>
          {label.toLowerCase().includes("signal") && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Signal transaction information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          {isAddress && (
            <div className="flex items-center space-x-2">
              <Blockie address={value} size={18} />
              <AddressLink address={value} />
              <CopyButton text={value} copied={copied} onCopy={handleCopy} />
            </div>
          )}
          {isHash && (
            <div className="flex items-center space-x-2">
              <AddressLink address={value} isHash />
              <CopyButton text={value} copied={copied} onCopy={handleCopy} />
            </div>
          )}
          {isNumber && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white">{formatNumericValue(value, label)}</span>
              {label.toLowerCase() === "blocknumber" && (
                <CopyButton text={value.toString()} copied={copied} onCopy={handleCopy} />
              )}
            </div>
          )}
          {!isAddress && !isHash && !isNumber && <span className="text-sm text-white">{formatNumericValue(value, label)}</span>}
        </div>
      </td>
    </tr>
  )
}

function TransferRow({
  transfer,
  tokens,
  isSpecialRow,
}: {
  transfer: TokenTransfer
  tokens: { symbol: string; address: string }[]
  isSpecialRow: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getBgColor = () => {
    if (transfer.type === "revenue") return "bg-mainCardV1"
    if (transfer.type === "cost") return "bg-mainCardV1"
    if (transfer.type === "profit") return "bg-mainCardV1/80"
    return ""
  }

  return (
    <tr className={`border-b border-mainBorderV1 ${getBgColor()}`}>
      <td className="py-3 px-4">
        {isSpecialRow ? (
          <div className="font-medium text-sm">{(transfer as any).type?.charAt(0).toUpperCase() + (transfer as any).type?.slice(1)}</div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Blockie address={transfer.address} size={18} />
              <a href={`/address/${transfer.address}`} className="text-[#4DC3E2] hover:underline truncate max-w-[180px] text-sm">
                {transfer.name ||
                  `${transfer.address.substring(0, 4)}...${transfer.address.substring(transfer.address.length - 4)}`}
              </a>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(transfer.address)}>
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
            </div>
            {transfer.protocol && (
              <Badge variant="outline" className="text-xs border-mainBorderV1">
                {transfer.protocol}
              </Badge>
            )}
          </div>
        )}
      </td>

      {tokens.map((token) => {
        const amount = transfer.amounts.find((a) => a.token === token.symbol)?.amount
        const isPositive = amount && amount > 0
        const isNegative = amount && amount < 0

        return (
          <td key={token.symbol} className="py-3 px-4 text-right">
            {amount !== undefined && (
              <div className="text-sm">
                {isPositive && <span className="text-[#49CE87] font-medium">{amount.toFixed(6)}</span>}
                {isNegative && <span className="text-red-500 font-medium">{amount.toFixed(6)}</span>}
                {!isPositive && !isNegative && amount !== 0 && <span className="text-white text-sm">{amount.toFixed(6)}</span>}
              </div>
            )}
          </td>
        )
      })}
    </tr>
  )
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-mainBackgroundV1 border border-mainBorderV1 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Separator />
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex justify-between py-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-64" />
            </div>
          ))}
      </Card>

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
                <th className="text-left">
                  <Skeleton className="h-5 w-32" />
                </th>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <th key={i} className="text-right">
                      <Skeleton className="h-5 w-16 ml-auto" />
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td className="py-2">
                      <Skeleton className="h-5 w-40" />
                    </td>
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <td key={j} className="text-right py-2">
                          <Skeleton className="h-5 w-16 ml-auto" />
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

function TransactionSummaryStyled({ data }: { data: TransactionSummaryData }) {
  const isMevTransaction = data.mevType && data.mevType !== "Transaction";
  const summaryEntries = Object.entries(data).filter(([key, value]) => {
    if (key === "timestamp" && data.time) return false; 
    if ((key === "profit" || key === "cost" || key === "revenue") && !isMevTransaction) {
      return false;
    }
    
    return true;
  });

  // Calculate relative time from timestamp
  const getTimeAgo = () => {
    const timestamp = data.timestamp || data.time;
    if (!timestamp) return "Unknown time";
    
    const txTime = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - txTime.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutes ago`;
    
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} hours ago`;
    
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay} days ago`;
  };

  return (
    <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-sm font-bold text-white">Overview</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1">
                  <IconInfoCircle className="h-4 w-4 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">Transaction overview details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7"
        >
          <IconMaximize className='text-mainActiveV1 !h-4 !w-4' />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <table className="w-full">
          <tbody>
            {summaryEntries.map(([key, value], index) => (
              <SummaryRow 
                key={key} 
                label={key} 
                value={value} 
                isLast={index === summaryEntries.length - 1} 
              />
            ))}
          </tbody>
        </table>
      </CardContent>
      
      <CardFooter>
        <div className="flex items-center justify-start mt-2 text-xs text-gray-400">
          <IconClock className="h-3 w-3 mr-1" />
          <span>{getTimeAgo()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function ArbitrageTransactionPage() {
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams<{ hash: string }>()
  const hash = params.hash || ""
  const {data: apiResponse} = useGetMevTransactionByHash(hash)
  
  const getTransactionType = (label: string | null | undefined) => {
    if (!label) return "None"
    
    switch(label.toUpperCase()) {
      case "ARBITRAGE":
        return "Arbitrage"
      case "SANDWICH":
        return "Sandwich"
      case "LIQUIDATION":
        return "Liquidation"
      default:
        return "None"
    }
  }
  
  const transactionType = getTransactionType(apiResponse?.data?.label)
  
  // Prepare transaction data from API response
  const transactionData = {
    summary: apiResponse ? {
      mevType: apiResponse.label || "Transaction",
      time: apiResponse.time || apiResponse.timestamp || "",
      transactionHash: apiResponse.hash || "",
      from: apiResponse.from || "",
      contractTo: apiResponse.to || "",
      profit: apiResponse.profit || "0",
      cost: apiResponse.cost || "0", 
      revenue: (() => {
        // Kiểm tra và sửa lỗi định dạng số trong revenue
        if (!apiResponse.revenue) return "0";
        if (apiResponse.revenue.includes(apiResponse.profit || "") && apiResponse.profit) {
          return apiResponse.profit;
        }
        return apiResponse.revenue;
      })(),
      blockNumber: apiResponse.blockNumber || 0,
      position: apiResponse.index || 0,
      gasPrice: apiResponse.gasPrice,
      gasUsed: apiResponse.gasUsed,
      timestamp: apiResponse.timestamp
    } : {
      mevType: "Transaction",
      time: "",
      transactionHash: "",
      from: "",
      contractTo: "",
      profit: "0",
      cost: "0",
      revenue: "0",
      blockNumber: 0,
      position: 0
    }
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
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">{transactionType}</h1>
                <div className="flex items-center space-x-1">
                  <button className="p-1 rounded-full hover:bg-accent/50">
                    <Image src="/images/sample-img.png" alt="Analysis" width={20} height={20} />
                  </button>
                  <button className="p-1 rounded-full hover:bg-accent/50">
                    <Image src="/images/sample-img.png" alt="Etherscan" width={20} height={20} />
                  </button>
                  <button className="p-1 rounded-full hover:bg-accent/50">
                    <Image src="/images/sample-img.png" alt="Tenderly" width={20} height={20} />
                  </button>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center space-x-1">
                  <SocialButton icon="twitter" />
                  <SocialButton icon="telegram" />
                  <SocialButton icon="reddit" />
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-400 mb-2">
              <span>For: {apiResponse?.data?.from ? `${apiResponse.data.from.substring(0, 6)}...${apiResponse.data.from.substring(apiResponse.data.from.length - 4)}` : "0x34a...c87c"}</span>
            </div>

            {isLoading ? (
              <LoadingState />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <TransactionSummaryStyled data={transactionData.summary} />
              </div>
            )}
          </div>
        </motion.div>
    </div>
  )
}