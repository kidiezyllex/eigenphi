"use client"

import { useState } from "react"
import { Paper } from "@/components/Common/Paper"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { ActionIcon } from "@/components/ui/action-icon"
import { IconArrowsMaximize } from "@tabler/icons-react"

interface FlashloanTrendProps {
  data: {
    labels: string[]
    volumes: number[]
    counts: number[]
  } | null
  isLoading: boolean
}

export function FlashloanTrend({ data, isLoading }: FlashloanTrendProps) {
  const [showVolume, setShowVolume] = useState(true)

  // Giả lập chart với dữ liệu. Trong thực tế, bạn sẽ sử dụng thư viện như Chart.js hoặc Recharts
  const renderPlaceholderChart = () => {
    if (isLoading) {
      return <Skeleton className="h-[300px] w-full" />
    }

    if (!data) {
      return <div className="h-[300px] flex items-center justify-center text-gray-400">No data available</div>
    }

    // Tìm giá trị lớn nhất để chuẩn hóa chiều cao
    const values = showVolume ? data.volumes : data.counts
    const maxValue = Math.max(...values)
    
    return (
      <div className="h-[300px] flex items-end gap-1">
        {values.map((value, index) => {
          const height = (value / maxValue) * 250 // Chuẩn hóa chiều cao (để lại 50px cho nhãn)
          return (
            <div key={index} className="flex flex-col items-center flex-1 min-w-0">
              <div 
                className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-400 transition-colors cursor-pointer group relative"
                style={{ height: `${height}px` }}
              >
                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {showVolume ? `${value.toLocaleString()} ETH` : `${value} transactions`}
                </div>
              </div>
              {index % 5 === 0 && (
                <div className="text-gray-400 text-xs mt-1 truncate w-full text-center">
                  {data.labels[index].slice(5)} {/* Chỉ hiển thị MM-DD */}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Paper className="overflow-hidden border border-mainBorderV1">
      <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold text-white">Trend</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Flashloan trend over time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className={`text-xs px-2 py-1 rounded ${
              showVolume ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"
            }`}
            onClick={() => setShowVolume(true)}
          >
            Volume
          </button>
          <button
            className={`text-xs px-2 py-1 rounded ${
              !showVolume ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"
            }`}
            onClick={() => setShowVolume(false)}
          >
            Transactions
          </button>
          <ActionIcon variant="ghost">
            <IconArrowsMaximize className="h-4 w-4" />
          </ActionIcon>
        </div>
      </div>
      <div className="p-4">
        {renderPlaceholderChart()}
      </div>
    </Paper>
  )
} 