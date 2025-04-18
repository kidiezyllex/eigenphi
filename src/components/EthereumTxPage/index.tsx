import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { useParams } from 'next/navigation'
import { useGetMevTransactionByHash } from '@/hooks/useMev'
import LoadingState from './LoadingState'
import TransactionSummary from './TransactionSummary'
import TracesTable from './TracesTable'
import SocialButton from './SocialButton'
import { getTransactionType } from './utils'
import { TransactionSummaryData } from './types'
import Icon from '@mdi/react'
import { mdiMagnify, mdiEthereum, mdiConsole } from '@mdi/js'

export const EthereumTxPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams<{ hash: string }>()
  const hash = params.hash || ""
  const {data: apiResponse} = useGetMevTransactionByHash(hash)
  
  const transactionType = getTransactionType(apiResponse?.label)
  
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
    } as TransactionSummaryData : {
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
              <div className="flex items-center justify-between w-full">
                <h1 className="text-2xl font-bold text-white">{transactionType}</h1>
                <div className="flex items-center space-x-1">
                  <button className="p-1 rounded-full hover:bg-accent/50">
                    <Icon path={mdiMagnify} size={0.8} className="text-white" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-accent/50">
                    <Icon path={mdiEthereum} size={0.8} className="text-white" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-accent/50">
                    <Icon path={mdiConsole} size={0.8} className="text-white" />
                  </button>
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
                <TransactionSummary data={transactionData.summary} />
                <TracesTable traces={apiResponse?.traces} />
              </div>
            )}
          </div>
        </motion.div>
    </div>
  )
}

export default EthereumTxPage 