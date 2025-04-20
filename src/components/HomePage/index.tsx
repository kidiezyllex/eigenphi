"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SegmentedControl } from "./SegmentedControl"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { PerformanceChart } from "./PerformanceChart"
import { TransactionProfitChart } from "./TransactionProfitChart"
import { TreemapChart } from "./TreemapChart"
import { LiveStreamTable } from "./LiveStreamTable"
import { ContractLeaderboard } from "./ContractLeaderboard"
import { TransactionLeaderboard } from "./TransactionLeaderboard"
import { IconInfoCircle, IconMaximize, IconClock } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { mockData } from "./mockData"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("24H")
  const [tokensView, setTokensView] = useState("chart")
  const [poolsView, setPoolsView] = useState("chart")

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-mainDarkBackgroundV1 text-white pl-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Market Overview</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center">
                <CardTitle className="text-sm font-bold text-white">Performance of MEV Types</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1">
                        <IconInfoCircle className="h-4 w-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Shows the performance of different MEV types over time</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-center items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7"
                >
                  <IconMaximize className='text-mainActiveV1 !h-4 !w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <SegmentedControl
                  data={[
                    { value: "profit", label: "By Profit", active: true },
                    { value: "volume", label: "By Volume" },
                  ]}
                  value="profit"
                  onChange={() => { }}
                  size="sm"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 mb-4">
                <div className="flex items-center justify-between p-2 rounded bg-mainBackgroundV1">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">
                      <i className="iconfont icon-arbitrage"></i>
                    </span>
                    <span className="text-sm text-gray-300">Arbitrage(7D)</span>
                  </div>
                  <span className="text-[#009CFA] font-medium">$1.86M</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-mainBackgroundV1">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">
                      <i className="iconfont icon-sandwich"></i>
                    </span>
                    <span className="text-sm text-gray-300">Sandwich(7D)</span>
                  </div>
                  <span className="text-[#49CE87] font-medium">$23.31k</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-mainBackgroundV1">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">
                      <i className="iconfont icon-liquidation"></i>
                    </span>
                    <span className="text-sm text-gray-300">Liquidation(7D)</span>
                  </div>
                  <span className="text-[#FFC800] font-medium">$1.35k</span>
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <PerformanceChart data={mockData.performanceData} />
              )}

            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-start mt-2 text-xs text-gray-400">
                <IconClock className="h-3 w-3 mr-1" />
                <span>29 minutes ago</span>
              </div>
            </CardFooter>
          </Card>

          {/* MEV Live-Stream */}
          <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <CardTitle className="text-sm font-medium text-mainGrayV1">MEV Live-Stream</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1">
                        <IconInfoCircle className="h-4 w-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Real-time stream of MEV transactions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button variant="ghost" className="h-8 text-xs text-[#4DC3E2]">
                More
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <LiveStreamTable data={mockData.liveStreamData} />
              )}

            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-start mt-2 text-xs text-gray-400">
                <IconClock className="h-3 w-3 mr-1" />
                <span>29 minutes ago</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* MEV Contract Profit Leaderboard */}
        <Card className="bg-mainBackgroundV1 border border-mainBorderV1 mb-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-mainGrayV1">MEV Contract Profit Leaderboard</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1">
                      <IconInfoCircle className="h-4 w-4 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">Top contracts by MEV profit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <SegmentedControl
                data={[
                  { value: "all", label: "ALL Types", active: true },
                  { value: "arbitrage", label: "Arbitrage" },
                  { value: "sandwich", label: "Sandwich" },
                  { value: "liquidation", label: "Liquidation" },
                ]}
                value="all"
                onChange={() => { }}
              />
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : (
              <ContractLeaderboard data={mockData.contractLeaderboardData} />
            )}
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-start mt-2 text-xs text-gray-400">
              <IconClock className="h-3 w-3 mr-1" />
              <span>29 minutes ago</span>
            </div>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* MEV Transaction Profit Distribution */}
          <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <CardTitle className="text-sm font-medium text-mainGrayV1">MEV Transaction Profit Distribution</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1">
                        <IconInfoCircle className="h-4 w-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Distribution of transaction profits</p>
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
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <TransactionProfitChart data={mockData.transactionProfitData} />
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <div className="flex items-center">
                  <IconClock className="h-3 w-3 mr-1" />
                  <span>2 hours ago</span>
                </div>
                <span>*PDF: Probability Density Function</span>
              </div>
            </CardContent>
          </Card>

          {/* MEV Transaction Profit Leaderboard */}
          <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <CardTitle className="text-sm font-medium text-mainGrayV1">MEV Transaction Profit Leaderboard</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1">
                        <IconInfoCircle className="h-4 w-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Top transactions by profit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <TransactionLeaderboard data={mockData.transactionLeaderboardData} />
              )}

            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-start mt-2 text-xs text-gray-400">
                <IconClock className="h-3 w-3 mr-1" />
                <span>29 minutes ago</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hot Tokens */}
          <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <CardTitle className="text-sm font-medium text-mainGrayV1">Hot Tokens</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1">
                        <IconInfoCircle className="h-4 w-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Most active tokens by volume</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button variant="ghost" className="h-8 text-xs text-[#4DC3E2]">
                More
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <SegmentedControl
                  data={[
                    { value: "chart", label: "Chart View", active: true, icon: "grid" },
                    { value: "table", label: "Table View", icon: "list" },
                  ]}
                  value={tokensView}
                  onChange={setTokensView}
                />
              </div>
              {loading ? <Skeleton className="h-[300px] w-full" /> : <TreemapChart data={mockData.hotTokensData} />}
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-start mt-2 text-xs text-gray-400">
                <IconClock className="h-3 w-3 mr-1" />
                <span>2 hours ago</span>
              </div>
            </CardFooter>
          </Card>

          {/* Hot Liquidity Pools */}
          <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <CardTitle className="text-sm font-medium text-mainGrayV1">Hot Liquidity Pools</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1">
                        <IconInfoCircle className="h-4 w-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Most active liquidity pools</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button variant="ghost" className="h-8 text-xs text-[#4DC3E2]">
                More
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <SegmentedControl
                  data={[
                    { value: "chart", label: "Chart View", active: true, icon: "grid" },
                    { value: "table", label: "Table View", icon: "list" },
                  ]}
                  value={poolsView}
                  onChange={setPoolsView}
                />
              </div>
              {loading ? <Skeleton className="h-[300px] w-full" /> : <TreemapChart data={mockData.hotPoolsData} />}
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-start mt-2 text-xs text-gray-400">
                <IconClock className="h-3 w-3 mr-1" />
                <span>28 minutes ago</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
