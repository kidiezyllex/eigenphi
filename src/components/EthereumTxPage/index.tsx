import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useGetMevTransactionByHash } from '@/hooks/useMev'
import LoadingState from './LoadingState'
import TransactionSummary from './TransactionSummary'
import TracesTable from './TracesTable'
import BlockTransactionsTable from './BlockTransactionsTable'
import { getTransactionType } from './utils'
import { MevType } from './types'
import Icon from '@mdi/react'
import { mdiMagnify, mdiEthereum, mdiConsole, mdiCog, mdiViewGrid, mdiCloseCircle } from '@mdi/js'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import CustomTabs from '../Common/CustomTabs'
import { useQuery } from '@tanstack/react-query'
import { getMevBlockByNumber } from '@/api/mev'
import TransactionDiagram from './TransactionDiagram'

export const EthereumTxPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const hash = usePathname().split('/')[5] || usePathname().split('/')[4]
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'token-flow'
  
  const { data: apiResponse, isLoading: isLoadingTransaction } = useGetMevTransactionByHash(hash)
  const shouldFetchBlock = Boolean(apiResponse?.blockNumber) && activeTab === 'block'
  const { data: blockData } = useQuery({
    queryKey: ['mev', 'block', apiResponse?.blockNumber],
    queryFn: () => getMevBlockByNumber(apiResponse?.blockNumber || 0),
    enabled: shouldFetchBlock
  })
  
  const tabs = [
    { id: 'token-flow', type: 'transactions', value: 'Token Flow' },
    { id: 'block-number', type: 'transactions', value: `For Block #${apiResponse?.blockNumber}` },
    { id: 'involving-from', type: 'transactions', value: 'Involving From' },
    { id: 'involving-to', type: 'transactions', value: 'Involving To' },
  ]
  
  const transactionType = getTransactionType(apiResponse?.label)

  const getSummaryData = (apiResponse: any) => {
    if (!apiResponse) {
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
    
    if (apiResponse?.label === "ARBITRAGE") {
      return {
        label: "ARBITRAGE",
        hash: apiResponse.hash,
        from: apiResponse.from,
        to: apiResponse.to,
        blockNumber: apiResponse.blockNumber,
        index: apiResponse.index,
        profit: apiResponse.profit,
        cost: apiResponse.cost,
        revenue: apiResponse.revenue,
        time: apiResponse.time,
        traces: apiResponse.traces,
        assetMetadata: apiResponse.assetMetadata
      };
    } 
    else if (apiResponse?.label === "SANDWICH") {
      return {
        label: "SANDWICH",
        id: apiResponse.id,
        blockNumber: apiResponse.blockNumber,
        profit: apiResponse.profit,
        cost: apiResponse.cost,
        revenue: apiResponse.revenue,
        time: apiResponse.time,
        frontRun: apiResponse.frontRun,
        victim: apiResponse.victim,
        backRun: apiResponse.backRun,
        assetMetadata: apiResponse.assetMetadata
      };
    } 
    else if (apiResponse?.label === "LIQUIDATION") {
      return {
        label: "LIQUIDATION",
        hash: apiResponse.hash,
        from: apiResponse.from,
        to: apiResponse.to,
        blockNumber: apiResponse.blockNumber,
        profit: apiResponse.profit,
        cost: apiResponse.cost,
        revenue: apiResponse.revenue,
        time: apiResponse.time,
        liquidator: apiResponse.liquidator,
        liquidationEvent: apiResponse.liquidationEvent,
        traces: apiResponse.traces,
        assetMetadata: apiResponse.assetMetadata
      };
    } 
    else {
      return {
        label: null,
        hash: apiResponse.hash,
        blockNumber: apiResponse.blockNumber,
        from: apiResponse.from,
        to: apiResponse.to,
        gasPrice: apiResponse.gasPrice,
        gasUsed: apiResponse.gasUsed,
        timestamp: apiResponse.timestamp,
        index: apiResponse.index
      };
    }
  }

  const transactionData = getSummaryData(apiResponse);
  
  const handleTabChange = (value: string) => {
    let tabParam = '';
    
    switch (value) {
      case 'Token Flow':
        tabParam = '';
        break;
      case `For Block #${apiResponse?.blockNumber}`:
        tabParam = 'block';
        break;
      case 'Involving From':
        tabParam = 'from';
        break;
      case 'Involving To':
        tabParam = 'to';
        break;
      default:
        tabParam = '';
    }
    
    if (tabParam) {
      router.push(`/mev/ethereum/tx/${hash}?tab=${tabParam}`);
    } else {
      router.push(`/mev/ethereum/tx/${hash}`);
    }
  }

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Render transaction content based on active tab
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    switch (activeTab) {
      case 'block':
        return (
          <div className="grid grid-cols-1 gap-6">
            <TransactionSummary data={transactionData as any} />
            <BlockTransactionsTable transactions={(blockData as any)?.transactions} />
          </div>
        );
      case 'from':
      case 'to':
        return (
          <div className="grid grid-cols-1 gap-6">
            <TransactionSummary data={transactionData as any} />
            <div className="p-6 bg-mainBackgroundV1 border border-mainBorderV1 rounded-md text-center">
              <p className="text-gray-400">Tính năng này sắp ra mắt.</p>
            </div>
          </div>
        );
      default:
        // Default token-flow tab
        if (transactionData?.label === "SANDWICH") {
          return (
            <div className="grid grid-cols-1 gap-6">
              <TransactionDiagram transactionHash={(transactionData as any)?.id || hash} />
              <TransactionSummary data={transactionData as any} />
              <h2 className="text-lg font-semibold text-white mt-2">Giao dịch Front Run</h2>
              <TracesTable traces={(apiResponse as any)?.frontRun?.[0]?.traces} />
              <h2 className="text-lg font-semibold text-white mt-2">Giao dịch Victim</h2>
              <TracesTable traces={(apiResponse as any)?.victim?.[0]?.traces} />
              <h2 className="text-lg font-semibold text-white mt-2">Giao dịch Back Run</h2>
              <TracesTable traces={(apiResponse as any)?.backRun?.[0]?.traces} />
            </div>
          );
        } else if (transactionData?.label === "LIQUIDATION") {
          return (
            <div className="grid grid-cols-1 gap-6">
              <TransactionDiagram transactionHash={(transactionData as any)?.hash || hash} />
              <TransactionSummary data={transactionData as any} />
              <h2 className="text-lg font-semibold text-white mt-2">Dấu vết thanh lý</h2>
              <TracesTable traces={apiResponse?.traces} />
            </div>
          );
        } else if (transactionData?.label === "ARBITRAGE") {
          return (
            <div className="grid grid-cols-1 gap-6">
              <TransactionDiagram transactionHash={(transactionData as any)?.hash || hash} />
              <TransactionSummary data={transactionData as any} />
              <h2 className="text-lg font-semibold text-white mt-2">Dấu vết arbitrage</h2>
              <TracesTable traces={apiResponse?.traces} />
            </div>
          );
        } else {
          // Normal transaction
          return (
            <div className="grid grid-cols-1 gap-6">
              <TransactionDiagram transactionHash={hash} />
              <TransactionSummary data={transactionData as any} />
              <TracesTable traces={apiResponse?.traces} />
            </div>
          );
        }
    }
  };

  return (
    <div className="min-h-screen bg-mainDarkBackgroundV1 text-white">
      {/* Header */}
      <div
        style={{
          backgroundImage: `url("/images/eigentx-bg.png")`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '30% auto',
        }}
        className="w-full h-[96px] relative flex items-center justify-between z-50 bg-background border-b border-mainBorderV1 shadow-sm">
        <div className="flex items-center justify-between gap-4 p-3 w-full">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center space-y-2">
              <Link href="/">
                <div className='text-mainActiveV1 text-xl font-bold flex items-center gap-0'>
                  <span className='mr-[-3px] tracking-tighter'>Mev</span>
                  <Icon path={mdiEthereum} size={1.2} className='text-mainActiveV1 mx-[-2px]' />
                  <span className='text-mainGrayV1 ml-[-3px] tracking-tighter'>Inspect</span>
                </div>
              </Link>

              <div className="flex flex-col">
                <div className="flex items-center rounded-full bg-black/20 p-1 gap-0.5">
                  {
                    ["icon1.svg", "icon2.png", "icon3.svg", "icon4.svg", "icon5.svg", "icon6.svg", "icon7.svg", "icon8.svg"].map((icon, index) => (
                      <div key={index} className="w-4 h-4 relative">
                        <Image
                          height={50}
                          width={50}
                          quality={100}
                          draggable={false}
                          src={`/images/${icon}`} alt={icon} className="w-full h-full" />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-1 w-full items-center h-12 bg-mainDarkBackgroundV1 rounded-sm'>
            <div className="flex-1">
              <div className="relative flex items-center pl-2 pr-10">
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {hash.slice(0, 6)}...{hash.slice(-4)}
                  <button className="ml-1">
                    <Icon path={mdiCloseCircle} size={0.8} className="text-mainGrayV1" />
                  </button>
                </Badge>
                <Input
                  placeholder="Tx Hash"
                  className="h-9 border-none focus:outline-none bg-transparent focus:ring-0 rounded-none text-white"
                ></Input>
              </div>
            </div>

            {/* Right section with actions */}
            <div className="flex items-center space-x-4 h-full ">
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-sm hover:bg-mainCardV1 transition-colors">
                  <Icon path={mdiViewGrid} size={0.7} className="text-mainActiveV1" />
                  <span className="text-sm text-mainActiveV1">TB Layout</span>
                </button>

                <div className="h-5 border-l border-mainBorderV1"></div>

                <button className="flex items-center space-x-1 px-3 py-2 rounded-sm hover:bg-mainCardV1 transition-colors">
                  <Icon path={mdiCog} size={0.7} className="text-mainGrayV1" />
                  <span className="text-sm text-mainGrayV1">More Settings</span>
                </button>
              </div>

              <button className="flex items-center h-full space-x-1 px-4 py-2 bg-mainActiveV1 text-white rounded-tr-sm rounded-br-sm hover:bg-mainActiveV1/90 transition-colors">
                <Icon path={mdiMagnify} size={0.8} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Tabslist */}
      <div className="h-20 px-5 flex items-center justify-start border-b border-b-mainBorderV1">
        <CustomTabs tabs={tabs} defaultSelected={tabs.find(tab => 
          (activeTab === 'token-flow' && tab.id === 'token-flow') ||
          (activeTab === 'block' && tab.id === 'block-number') ||
          (activeTab === 'from' && tab.id === 'involving-from') ||
          (activeTab === 'to' && tab.id === 'involving-to')
        )?.value || tabs[0].value} onChange={handleTabChange} />
      </div>

      <div className="px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center mb-4 mt-4">
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

            {renderContent()}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EthereumTxPage 