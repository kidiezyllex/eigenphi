import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Paper } from "@/components/Common/Paper"

export default function MevLiveStreamSkeleton() {
  return (
    <div className="container mx-auto py-4 px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold">MEV Live-Stream</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">MEV (Maximal Extractable Value) transactions on Ethereum blockchain</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Paper className="overflow-hidden">
          <ScrollArea className="h-[calc(100vh-150px)]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background border-b border-b-mainBorderV1">
                <TableRow>
                  <TableHead className="w-[5%]">Time</TableHead>
                  <TableHead className="w-[8%]">Tx</TableHead>
                  <TableHead className="w-[8%]">Block</TableHead>
                  <TableHead className="w-[10%]">Token</TableHead>
                  <TableHead className="w-[12%] text-left">From</TableHead>
                  <TableHead className="w-[12%] text-left">Contract</TableHead>
                  <TableHead className="w-[8%] text-right">Profit</TableHead>
                  <TableHead className="w-[8%] text-right">Cost</TableHead>
                  <TableHead className="w-[8%] text-right">Revenue</TableHead>
                  <TableHead className="w-[10%] text-right">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 15 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="h-4 w-4 rounded-full" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Paper>
      </div>
    </div>
  )
}
