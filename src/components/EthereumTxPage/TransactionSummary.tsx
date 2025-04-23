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
  let summaryEntries: [string, any][] = [];
  
  if ((data as any).label === "SANDWICH") {
    summaryEntries.push(["Transaction Type", "SANDWICH"]);
    const excludedFields = ["label", "id", "blockNumber", "profit", "cost", "revenue", "time", "frontRun", "victim", "backRun", "assetMetadata", "mevType"];
    if ((data as any).profit !== undefined) summaryEntries.push(["Lợi nhuận", (data as any).profit + " ETH"]);
    if ((data as any).cost !== undefined) summaryEntries.push(["Chi phí", (data as any).cost + " ETH"]);
    if ((data as any).revenue !== undefined) summaryEntries.push(["Doanh thu", (data as any).revenue + " ETH"]);
    if ((data as any).blockNumber !== undefined) summaryEntries.push(["Số khối", (data as any).blockNumber]);
    Object.entries(data).forEach(([key, value]) => {
      if (!excludedFields.includes(key) && key !== "sandwichId" && value !== undefined) {
        summaryEntries.push([key, value]);
      }
    });
  } else if ((data as any).label === "ARBITRAGE") {
    summaryEntries.push(["Transaction Type", "ARBITRAGE"]);
    
    if ((data as any).hash) summaryEntries.push(["Hash", (data as any).hash]);
    if ((data as any).from) summaryEntries.push(["Sender", (data as any).from]);
    if ((data as any).to) summaryEntries.push(["Recipient", (data as any).to]);
    if ((data as any).blockNumber) summaryEntries.push(["Block Number", (data as any).blockNumber]);
    if ((data as any).index !== undefined) summaryEntries.push(["Index", (data as any).index]);
    
    if ((data as any).profit !== undefined) summaryEntries.push(["Profit", (data as any).profit + " ETH"]);
    if ((data as any).cost !== undefined) summaryEntries.push(["Cost", (data as any).cost + " ETH"]);
    if ((data as any).revenue !== undefined) summaryEntries.push(["Revenue", (data as any).revenue + " ETH"]);
    if ((data as any).time) summaryEntries.push(["Time", (data as any).time]);
  } else if ((data as any).label === "LIQUIDATION") {
    summaryEntries.push(["Transaction Type", "LIQUIDATION"]);
    
    if ((data as any).hash) summaryEntries.push(["Hash", (data as any).hash]);
    if ((data as any).from) summaryEntries.push(["Sender", (data as any).from]);
    if ((data as any).to) summaryEntries.push(["Recipient", (data as any).to]);
    if ((data as any).blockNumber) summaryEntries.push(["Block Number", (data as any).blockNumber]);
    if ((data as any).time) summaryEntries.push(["Time", (data as any).time]);
    
    if ((data as any).profit !== undefined) summaryEntries.push(["Profit", (data as any).profit.toString() + " ETH"]);
    if ((data as any).cost !== undefined) summaryEntries.push(["Cost", (data as any).cost.toString() + " ETH"]);
    if ((data as any).revenue !== undefined) summaryEntries.push(["Revenue", (data as any).revenue.toString() + " ETH"]);
    
    if ((data as any).liquidator) summaryEntries.push(["Liquidator", (data as any).liquidator]);
    
    if ((data as any).liquidationEvent && (data as any).liquidationEvent.length > 0) {
      const event = (data as any).liquidationEvent[0];
      if (event.borrower) summaryEntries.push(["Borrower", event.borrower]);
      if (event.liquidatedToken) summaryEntries.push(["Liquidated Token", event.liquidatedToken]);
      if (event.liquidatedAmount) summaryEntries.push(["Liquidated Amount", event.liquidatedAmount.toString()]);
      if (event.debtToken) summaryEntries.push(["Debt Token", event.debtToken]);
      if (event.debtToCover) summaryEntries.push(["Debt to Cover", event.debtToCover.toString()]);
    }
  } else {
    summaryEntries.push(["Transaction Type", "NORMAL"]);
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "label" && key !== "timestamp" && value !== undefined && key !== "mevType") {
        if (key === "time" && (data as any).timestamp) return;
        
        if (key === "hash") {
          summaryEntries.push(["Hash", value]);
        } else if (key === "from") {
          summaryEntries.push(["Sender", value]);
        } else if (key === "to") {
          summaryEntries.push(["Recipient", value]);
        } else if (key === "blockNumber") {
          summaryEntries.push(["Block Number", value]);
        } else if (key === "gasPrice" && value) {
          summaryEntries.push(["Gas Price", value + " Gwei"]);
        } else if (key === "gasUsed") {
          summaryEntries.push(["Gas Used", value]);
        } else if (key === "timestamp") {
          summaryEntries.push(["Time", value]);
        } else if (key === "index") {
          summaryEntries.push(["Index", value]);
        } else {
          summaryEntries.push([key, value]);
        }
      }
    });
  }

  const getTimeAgo = () => {
    const timestamp = (data as any).timestamp || (data as any).time;
    if (!timestamp) return "Time not determined";
    
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
                <p className="w-[200px] text-xs">Detailed overview of the transaction</p>
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
                key={`${key}-${index}`}
                label={key} 
                value={value} 
                isLast={index === summaryEntries.length - 1}
                sandwichData={(data as any).label === "SANDWICH" ? (data as any) : undefined} 
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