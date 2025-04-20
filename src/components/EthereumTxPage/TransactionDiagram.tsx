import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconInfoCircle, IconMaximize } from '@tabler/icons-react'
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"

interface TransactionDiagramProps {
  transactionHash: string
}

const TransactionDiagram: React.FC<TransactionDiagramProps> = ({ transactionHash }) => {
  const diagramUrl = `https://tx.eigenphi.io/analyseTransaction.svg?chain=ALL&tx=${transactionHash}`
  const [open, setOpen] = useState(false)

  return (
    <Card className="bg-mainBackgroundV1 border border-mainBorderV1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-sm font-bold text-white">Transaction Diagram</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1">
                  <IconInfoCircle className="h-4 w-4 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">Visual representation of transaction flow</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7"
          onClick={() => setOpen(true)}
        >
          <IconMaximize className='text-mainActiveV1 !h-4 !w-4' />
        </Button>
      </CardHeader>

      <CardContent className="p-4 flex justify-center items-center overflow-hidden">
        {transactionHash ? (
          <div className="w-full max-h-[500px] overflow-auto">
            <img 
              src={diagramUrl} 
              alt="Transaction Diagram" 
              className="w-full h-auto cursor-pointer"
              onClick={() => setOpen(true)}
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/diagram-placeholder.svg';
              }}
            />
            <Lightbox
              open={open}
              close={() => setOpen(false)}
              slides={[{ src: diagramUrl }]}
              plugins={[Zoom]}
              zoom={{
                maxZoomPixelRatio: 3,
                scrollToZoom: true
              }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <p>No transaction data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TransactionDiagram 