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
import { MevType, TransactionSummaryData } from './types'
import Icon from '@mdi/react'
import { mdiMagnify, mdiEthereum, mdiConsole } from '@mdi/js'
import { de } from 'date-fns/locale'

export const EthereumTxPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams<{ hash: string }>()
  const hash = params.hash || ""
  const {data: apiResponse} = useGetMevTransactionByHash(hash)
  
  const transactionType = getTransactionType(apiResponse?.label)
  
  const getSummaryData = (apiResponse: any) => {
    switch (apiResponse?.label) {
      case MevType.Arbitrage.toUpperCase(): {
        return {
          mevType: apiResponse.label,
          time: apiResponse.time,
          transactionHash: apiResponse.hash,
          from: apiResponse.from,
          contractTo: apiResponse.to,
          profit: apiResponse.profit,
          cost: apiResponse.cost, 
          revenue: (() => {
            if (!apiResponse.revenue) return "0";
            if (apiResponse.revenue.includes(apiResponse.profit || "") && apiResponse.profit) {
              return apiResponse.profit;
            }
            return apiResponse.revenue;
          })(),
          blockNumber: apiResponse.blockNumber,
          position: apiResponse.index,
          timestamp: apiResponse.timestamp
        } 
      }
      case MevType.Sandwich.toUpperCase(): {
        return {
            label: MevType.Sandwich, 
            sandwichId: apiResponse.id,
            blockNumber: apiResponse.blockNumber,
            profit: apiResponse.profit,
            cost: apiResponse.cost,
            revenue: apiResponse.revenue,
            time: apiResponse.time,
          }
      }
      case MevType.Liquidation.toUpperCase(): {
        return {
            label: MevType.Liquidation, 
            transactionHash: apiResponse.hash,
            blockNumber: apiResponse.blockNumber,
            from: apiResponse.from,
            contractTo: apiResponse.to,
            profit: apiResponse.profit,
            cost: apiResponse.cost,
            revenue: apiResponse.revenue,
            time: apiResponse.time,
            borrower: apiResponse.borrower,
            liquidator: apiResponse.liquidator,
            debtToken: apiResponse.debtToken,
            debtToCover: apiResponse.debtToCover,
            liquidatedToken: apiResponse.liquidatedToken,
            liquidatedAmount: apiResponse.liquidatedAmount,
          }
      }
    }
    if (!apiResponse.label) {
      return {
        label: MevType.Normal,
        transactionHash: apiResponse.hash,
        from: apiResponse.from,
        contractTo: apiResponse.to,
        blockNumber: apiResponse.blockNumber,
        gasPrice: apiResponse.gasPrice,
        gasUsed: apiResponse.gasUsed,
        time: apiResponse.time,
        timestamp: apiResponse.timestamp
      }
    }
    return {
      label: "None",
      transactionHash: "",
      from: "",
      contractTo: "",
      blockNumber: 0,
      gasPrice: "",
      gasUsed: "",
      time: "",
      timestamp: ""
    }
  }

  const transactionData = getSummaryData(apiResponse);
  
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

            {isLoading ? (
                <LoadingState />
              ) : apiResponse?.label === "SANDWICH" ? (
                <div className="grid grid-cols-1 gap-6">
                  <TransactionSummary data={transactionData} />
                  <h2>Front Run</h2>
                  {/* <h6>Tx Index: {apiResponse?.frontRun[0]?.transactionLogIndex}</h6> */}
                  <TracesTable traces={apiResponse?.frontRun[0]?.traces} />
                  <h2>Victim</h2>
                  {/* <h6>Tx Index: {apiResponse?.victim[0]?.transactionLogIndex}</h6> */}
                  <TracesTable traces={apiResponse?.victim[0]?.traces} />
                  <h2>Back Run</h2>
                  {/* <h6>Tx Index: {apiResponse?.backRun[0]?.transactionLogIndex}</h6> */}
                  <TracesTable traces={apiResponse?.backRun[0]?.traces} />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <TransactionSummary data={transactionData} />
                  <TracesTable traces={apiResponse?.traces} />
                </div>
              )}
          </div>
        </motion.div>
    </div>
  )
}

export default EthereumTxPage 