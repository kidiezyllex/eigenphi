"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Copy } from "lucide-react"
import { TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { formatAddress, formatTimestamp, formatCurrency } from "@/lib/utils"
import { Blockies } from "@/components/Common/Blockies"
import { Transaction } from "../MevLiveStream"

interface TransactionRowProps {
  transaction: Transaction
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <>
      <TableCell>
        <Link href={`/mev/ethereum/tx/${transaction.txHash}`} className="text-primary hover:underline">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm text-muted-foreground">{formatTimestamp(transaction.timestamp)}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{new Date(transaction.timestamp).toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
      </TableCell>

      <TableCell>
        <div className="flex items-center">
          <Link href={`/mev/ethereum/tx/${transaction.txHash}`} className="text-sm text-primary hover:underline">
            {formatAddress(transaction.txHash)}
          </Link>
        </div>
      </TableCell>

      <TableCell>
        <Link
          href={`/mev/eigentx/${transaction.txHash}?tab=block`}
          className="text-sm text-primary hover:underline flex items-center"
        >
          {transaction.blockNumber}
          {transaction.position && (
            <Badge variant="outline" className="ml-1 h-5 min-w-[1.5rem] px-1">
              {transaction.position}
            </Badge>
          )}
        </Link>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap items-center gap-0.5">
          {transaction.tokens.slice(0, 7).map((token: any, idx: number) => (
            <div key={`${token.symbol}-${idx}`} className="relative w-4 h-4 rounded-full overflow-hidden">
              <Image
                src={"/images/sample-img.png"}
                alt={token.symbol}
                width={16}
                height={16}
                className="object-cover"
              />
            </div>
          ))}

          {transaction.tokens.length > 7 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground">…</span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {transaction.tokens.slice(7).map((token: any, idx: number) => (
                      <div key={`tooltip-${token.symbol}-${idx}`} className="flex items-center gap-1">
                        <Image
                          src={token.iconUrl}
                          alt={token.symbol}
                          width={16}
                          height={16}
                          className="rounded-full"
                        />
                        <span className="text-xs">{token.symbol}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>

      <TableCell align="left">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Blockies address={transaction.from} size={18} />
            <span className="text-sm">{formatAddress(transaction.from)}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(transaction.from, "from")}
                >
                  <Copy className="h-3.5 w-3.5 text-mainGrayV1" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{copied === "from" ? "Copied!" : "Copy address"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>

      <TableCell align="left">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Blockies address={transaction.contract} size={18} />
            <Link
              href={`/mev/ethereum/contract/${transaction.contract}`}
              className="text-sm text-primary hover:underline"
            >
              {formatAddress(transaction.contract)}
            </Link>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(transaction.contract, "contract")}
                >
                  <Copy className="h-3.5 w-3.5 text-mainGrayV1" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{copied === "contract" ? "Copied!" : "Copy address"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>

      <TableCell align="right">
        <span
          className={cn(
            "text-sm",
            transaction.profit < 0 ? "text-destructive" : transaction.profit > 0 ? "text-green-500" : "",
          )}
        >
          {formatCurrency(transaction.profit)}
        </span>
      </TableCell>

      <TableCell align="right">
        <span className="text-sm">{formatCurrency(transaction.cost)}</span>
      </TableCell>

      <TableCell align="right">
        <span className="text-sm">{formatCurrency(transaction.revenue)}</span>
      </TableCell>

      <TableCell align="right">
        <div className="flex justify-end">
          <span className="text-sm">{transaction.type}</span>
        </div>
      </TableCell>
    </>
  )
}
