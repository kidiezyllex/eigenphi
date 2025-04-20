import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconClock, IconInfoCircle, IconMaximize } from '@tabler/icons-react'
import SummaryRow from './SummaryRow'
import { MevType, TransactionSummaryData } from './types'

interface TransactionSummaryProps {
  data: TransactionSummaryData
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ data }) => {
  const isMevTransaction = data.mevType && data.mevType !== MevType.Normal;
  const summaryEntries = Object.entries(data).filter(([key, value]) => {
    if (key === "timestamp" && data.time) return false; 
    if ((key === "profit" || key === "cost" || key === "revenue") && !isMevTransaction) {
      return false;
    }
    
    return true;
  });

  // Calculate relative time from timestamp
  const getTimeAgo = () => {
    const timestamp = data.timestamp || data.time;
    if (!timestamp) return "Unknown time";
    
    const txTime = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - txTime.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutes ago`;
    
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} hours ago`;
    
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay} days ago`;
  };

  return (
    <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-sm font-bold text-white">Overview</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1">
                  <IconInfoCircle className="h-4 w-4 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">Transaction overview details</p>
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

      <CardContent className="p-0">
        <table className="w-full">
          <tbody>
            {summaryEntries.map(([key, value], index) => (
              <SummaryRow 
                key={key} 
                label={key} 
                value={value} 
                isLast={index === summaryEntries.length - 1} 
              />
            ))}
          </tbody>
        </table>
      </CardContent>
      
      <CardFooter>
        <div className="flex items-center justify-start mt-2 text-xs text-gray-400">
          <IconClock className="h-3 w-3 mr-1" />
          <span>{getTimeAgo()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default TransactionSummary 