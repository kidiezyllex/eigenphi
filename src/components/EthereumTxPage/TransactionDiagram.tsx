import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconInfoCircle, IconMaximize } from '@tabler/icons-react'
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import { mdiChartLine } from '@mdi/js'
import Icon from '@mdi/react'

interface TransactionDiagramProps {
    transactionHash: string
}

const TransactionDiagram: React.FC<TransactionDiagramProps> = ({ transactionHash }) => {
    const isValidHash = useMemo(() => {
        return transactionHash && /^0x([A-Fa-f0-9]{64})$/.test(transactionHash)
    }, [transactionHash])

    const diagramUrl = useMemo(() => {
        return isValidHash
            ? `https://tx.eigenphi.io/analyseTransaction.svg?chain=ALL&tx=${transactionHash}`
            : ''
    }, [transactionHash, isValidHash])

    const [open, setOpen] = useState(false)
    const [imageLoadError, setImageLoadError] = useState(false);

    useEffect(() => {
        if (isValidHash && diagramUrl) {
            setImageLoadError(false); // Reset error state
            fetch(diagramUrl)
                .then(response => {
                    if (!response.ok) {
                        // Handle non-2xx status codes, including 404
                        console.error(`Failed to load transaction diagram: ${response.status}`);
                        setImageLoadError(true);
                    } else {
                        setImageLoadError(false);
                    }
                })
                .catch(error => {
                    // Handle network errors
                    console.error('Network error fetching transaction diagram:', error);
                    setImageLoadError(true);
                });
        } else {
            setImageLoadError(false); // No valid hash or URL, no image error
        }
    }, [diagramUrl, isValidHash]);

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
                {isValidHash && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-mainCardV1 hover:bg-mainActiveV1/10 h-7 w-7"
                        onClick={() => setOpen(true)}
                    >
                        <IconMaximize className='text-mainActiveV1 !h-4 !w-4' />
                    </Button>
                )}
            </CardHeader>

            <CardContent className="p-4 flex justify-center items-center overflow-hidden">
                {isValidHash && !imageLoadError ? (
                    <div className="w-full max-h-[500px] overflow-auto" style={{ backgroundColor: '#141517' }}>
                        <img
                            src={diagramUrl}
                            alt="Transaction Diagram"
                            className="w-full h-auto cursor-pointer"
                            onClick={() => setOpen(true)}
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
                            styles={{ container: { backgroundColor: '#141517' } }}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                        <Icon path={mdiChartLine} size={1} className="text-mainGrayV1 mb-2" />
                        <p className="text-mainGrayV1 text-center">Transaction Diagram does not exist!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TransactionDiagram 