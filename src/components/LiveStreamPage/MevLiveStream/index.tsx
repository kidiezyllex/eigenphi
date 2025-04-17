"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TransactionRow } from "@/components/LiveStreamPage/TransactionRow"
import { getMevTransactions } from "@/components/LiveStreamPage/mockData"
import { Paper } from "@/components/Common/Paper"

export interface TokenIcon {
    symbol: string
    iconUrl: string
  }
  
  export interface Transaction {
    txHash: string
    timestamp: number
    blockNumber: number
    position?: number
    tokens: TokenIcon[]
    from: string
    contract: string
    profit: number
    cost: number
    revenue: number
    type: string
  }
  
export default function MevLiveStream() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await getMevTransactions()
        setTransactions(data)
      } catch (error) {
        console.error("Failed to fetch MEV transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Set up polling for live updates
    const intervalId = setInterval(fetchData, 15000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="px-6 bg-mainDarkBackgroundV1">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">MEV Live-Stream</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">MEV (Maximal Extractable Value) transactions on Ethereum blockchain</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Paper className="overflow-hidden border border-mainBorderV1">
          <ScrollArea className="h-[calc(100vh-150px)]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background border-b border-b-mainBorderV1 hover:!bg-mainCardV1/50">
                <TableRow>
                  <TableHead className="w-[5%]">Time</TableHead>
                  <TableHead className="w-[8%]">Tx</TableHead>
                  <TableHead className="w-[8%]">Block</TableHead>
                  <TableHead className="w-[10%]">Token</TableHead>
                  <TableHead className="w-[12%] text-left">From</TableHead>
                  <TableHead className="w-[12%] text-left">Contract</TableHead>
                  <TableHead className="w-[8%] text-right">Profit</TableHead>
                  <TableHead className="w-[8%] text-right">Cost</TableHead>
                  <TableHead className="w-[8%] text-right">Revenue</TableHead>
                  <TableHead className="w-[10%] text-right">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {transactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.txHash}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TransactionRow transaction={transaction} />
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </ScrollArea>
        </Paper>
      </div>
    </div>
  )
}
