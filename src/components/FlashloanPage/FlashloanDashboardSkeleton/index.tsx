import { Skeleton } from "@/components/ui/skeleton"
import { Paper } from "@/components/Common/Paper"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ActionIcon } from "@/components/ui/action-icon"
import { IconArrowsMaximize } from "@tabler/icons-react"

export default function FlashloanDashboardSkeleton() {
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
          {/* Summary Widget Skeleton */}
          <Paper className="overflow-hidden border border-mainBorderV1">
            <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold text-white">Summary</h4>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-mainBorderV1 pb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </Paper>

          {/* Trend Widget Skeleton */}
          <Paper className="overflow-hidden border border-mainBorderV1">
            <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold text-white">Trend</h4>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </div>
              <ActionIcon variant="ghost">
                <IconArrowsMaximize className="h-4 w-4" />
              </ActionIcon>
            </div>
            <div className="p-4">
              <Skeleton className="h-[300px] w-full" />
            </div>
          </Paper>
        </div>

        {/* Top Flashloan Table Skeleton */}
        <Paper className="overflow-hidden border border-mainBorderV1">
          <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-white">Top Flashloan</h4>
              <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </div>
            <ActionIcon variant="ghost">
              <IconArrowsMaximize className="h-4 w-4" />
            </ActionIcon>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-4 py-3 border-b border-mainBorderV1">
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[20%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[15%]" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </Paper>

        {/* Latest Flashloan Table Skeleton */}
        <Paper className="overflow-hidden border border-mainBorderV1">
          <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-white">Latest Flashloan</h4>
              <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </div>
            <ActionIcon variant="ghost">
              <IconArrowsMaximize className="h-4 w-4" />
            </ActionIcon>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-4 py-3 border-b border-mainBorderV1">
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[20%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[15%]" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </Paper>

        {/* Protocols Table Skeleton */}
        <Paper className="overflow-hidden border border-mainBorderV1">
          <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-white">Protocols</h4>
              <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </div>
            <ActionIcon variant="ghost">
              <IconArrowsMaximize className="h-4 w-4" />
            </ActionIcon>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-4 py-3 border-b border-mainBorderV1">
                  <Skeleton className="h-6 w-[20%]" />
                  <Skeleton className="h-6 w-[25%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[10%]" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </Paper>
      </div>
    </div>
  )
} 