import React, { useState } from 'react'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import Blockie from './Blockie'
import AddressLink from './AddressLink'
import CopyButton from './CopyButton'
import TransactionHashLink from './TransactionLink'

interface SummaryRowProps {
  label: string
  value: any
  isLast: boolean
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, isLast }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatLabel = (label: string) => {
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
    if (["profit", "cost", "revenue"].includes(label.toLowerCase())) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return `${num.toFixed(6)} USD`;
      }
    }
    if (label.toLowerCase() === "time") {
      const date = new Date(value);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} UTC`;
    }
    return value;
  }

  const isAddress = typeof value === "string" && value.startsWith("0x") && value.length === 42
  const isHash = typeof value === "string" && value.startsWith("0x") && value.length === 66
  const isNumber = typeof value === "number" || !isNaN(Number(value))

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
        {isAddress ? (
        <div className="flex items-center space-x-2">
          <Blockie address={value} size={18} />
          <AddressLink address={value} shorten={false} />
          <CopyButton text={value} copied={copied} onCopy={handleCopy} />
        </div>
      ) : isHash ? (
        <div className="flex items-center space-x-2">
          <TransactionHashLink hash={value} shorten={false} />
          <CopyButton text={value} copied={copied} onCopy={handleCopy} />
        </div>
      ) : isNumber ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white">{formatNumericValue(value, label)}</span>
          {label.toLowerCase() === "blocknumber" && (
            <CopyButton text={value.toString()} copied={copied} onCopy={handleCopy} />
          )}
        </div>
      ) : (
        <span className="text-sm text-white">{formatNumericValue(value, label)}</span>
      )}
        </div>
      </td>
    </tr>
  )
}

export default SummaryRow 