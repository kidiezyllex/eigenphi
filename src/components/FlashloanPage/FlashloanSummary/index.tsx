import { Paper } from "@/components/Common/Paper"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

interface SummaryItemProps {
  label: string
  value: string | number
  isLoading?: boolean
}

const SummaryItem = ({ label, value, isLoading = false }: SummaryItemProps) => {
  return (
    <div className="flex justify-between items-center border-b border-mainBorderV1 pb-2">
      <span className="text-sm text-gray-400">{label}</span>
      {isLoading ? (
        <Skeleton className="h-4 w-24" />
      ) : (
        <span className="text-sm font-medium text-white">{value}</span>
      )}
    </div>
  )
}

interface FlashloanSummaryProps {
  data: {
    totalAmount: number
    totalTransactions: number
    averageAmount: number
    largestAmount: number
    activeUsers: number
    protocols: number
  } | null
  isLoading: boolean
}

export function FlashloanSummary({ data, isLoading }: FlashloanSummaryProps) {
  return (
    <Paper className="overflow-hidden border border-mainBorderV1">
      <div className="p-4 flex items-center justify-between border-b border-mainBorderV1">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold text-white">Summary</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Summary of flashloan statistics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-3">
          <SummaryItem 
            label="Total Amount" 
            value={isLoading ? "" : `${data?.totalAmount.toLocaleString()} ETH`} 
            isLoading={isLoading} 
          />
          <SummaryItem 
            label="Total Transactions" 
            value={isLoading ? "" : data?.totalTransactions.toLocaleString() || 0} 
            isLoading={isLoading} 
          />
          <SummaryItem 
            label="Average Amount" 
            value={isLoading ? "" : `${data?.averageAmount.toLocaleString()} ETH`} 
            isLoading={isLoading} 
          />
          <SummaryItem 
            label="Largest Amount" 
            value={isLoading ? "" : `${data?.largestAmount.toLocaleString()} ETH`} 
            isLoading={isLoading} 
          />
          <SummaryItem 
            label="Active Users" 
            value={isLoading ? "" : data?.activeUsers.toLocaleString() || 0} 
            isLoading={isLoading} 
          />
          <SummaryItem 
            label="Protocols" 
            value={isLoading ? "" : data?.protocols.toLocaleString() || 0} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </Paper>
  )
} 