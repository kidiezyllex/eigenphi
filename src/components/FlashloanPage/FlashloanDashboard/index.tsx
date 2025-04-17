"use client"

import { useState, useEffect } from "react"
import { Paper } from "@/components/Common/Paper"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { ActionIcon } from "@/components/ui/action-icon"
import { IconArrowsMaximize } from "@tabler/icons-react"
import { FlashloanSummary } from "../FlashloanSummary"
import { FlashloanTrend } from "../FlashloanTrend"
import { FlashloanTopTable } from "../FlashloanTopTable"
import { FlashloanLatestTable } from "../FlashloanLatestTable"
import { FlashloanProtocolsTable } from "../FlashloanProtocolsTable"
import { getMockFlashloanData } from "../mockData"

export default function FlashloanDashboard() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Simulating API call with mock data
        const mockData = await getMockFlashloanData()
        setData(mockData)
      } catch (error) {
        console.error("Failed to fetch flashloan data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="pl-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-2xl font-bold text-white">Flashloan</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Ethereum flashloan data and statistics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Summary Widget */}
          <FlashloanSummary isLoading={isLoading} data={data?.summary} />

          {/* Trend Widget */}
          <FlashloanTrend isLoading={isLoading} data={data?.trend} />
        </div>

        {/* Top Flashloan Table */}
        <Paper className="overflow-hidden border border-mainBorderV1">
          <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-white">Top Flashloan</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Top flashloan transactions by amount</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ActionIcon variant="ghost">
              <IconArrowsMaximize className="h-4 w-4" />
            </ActionIcon>
          </div>
          <ScrollArea className="h-[400px]">
            <FlashloanTopTable isLoading={isLoading} data={data?.topFlashloan} />
          </ScrollArea>
        </Paper>

        {/* Latest Flashloan Table */}
        <Paper className="overflow-hidden border border-mainBorderV1">
          <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-white">Latest Flashloan</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Most recent flashloan transactions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ActionIcon variant="ghost">
              <IconArrowsMaximize className="h-4 w-4" />
            </ActionIcon>
          </div>
          <ScrollArea className="h-[400px]">
            <FlashloanLatestTable isLoading={isLoading} data={data?.latestFlashloan} />
          </ScrollArea>
        </Paper>

        {/* Protocols Table */}
        <Paper className="overflow-hidden border border-mainBorderV1">
          <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-white">Protocols</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Protocols used for flashloans</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ActionIcon variant="ghost">
              <IconArrowsMaximize className="h-4 w-4" />
            </ActionIcon>
          </div>
          <ScrollArea className="h-[400px]">
            <FlashloanProtocolsTable isLoading={isLoading} data={data?.protocols} />
          </ScrollArea>
        </Paper>
      </div>
    </div>
  )
} 