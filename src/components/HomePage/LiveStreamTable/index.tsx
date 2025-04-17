"use client"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import { useState } from "react"

interface LiveStreamTableProps {
  data: {
    id: string
    blockNumber: string
    time: string
    type: string
    tokens: string[]
    tokenIcons: string[]
    locations: number
    contract: string
    contractShort: string
    profit: string
    cost: string
  }[]
}

export function LiveStreamTable({ data }: LiveStreamTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  return (
    <motion.div
      className="overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-4 gap-2 mb-2 px-2 text-xs text-gray-400">
        <div></div>
        <div className="flex justify-center">Contract</div>
        <div className="flex justify-center">Profit</div>
        <div className="flex justify-center">Cost</div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <motion.div
            key={item.id}
            className={`grid grid-cols-4 gap-2 p-2 bg-mainBackgroundV1 border border-[#252631] rounded-md text-xs transition-colors duration-200 ${
              hoveredRow === item.id ? "bg-[#25262B]" : ""
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onMouseEnter={() => setHoveredRow(item.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-gray-300">{item.blockNumber}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-gray-500 cursor-help">{item.time}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Transaction time</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-gray-400 mr-1">
                  <i className={`iconfont icon-${item.type.toLowerCase()}`}></i>
                </span>
                <span className="text-gray-300">{item.type}</span>
                <div className="flex ml-1">
                  {item.tokenIcons.map((icon, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-4 h-4 rounded-full overflow-hidden -ml-1 first:ml-0 border border-[#1A1B1E] cursor-help">
                            <Image
                              src={icon || "/placeholder.svg"}
                              alt={item.tokens[i] || "token"}
                              width={16}
                              height={16}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{item.tokens[i]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4 cursor-help">
                        <span className="text-gray-400 mr-1">
                          <i className="iconfont icon-location"></i>
                        </span>
                        {item.locations}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Number of locations involved in this transaction</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 cursor-help">
                      <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-700"></div>
                      <span className="text-gray-300">{item.contractShort}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Full contract: {item.contract}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-gray-300 cursor-help">{item.profit}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Profit from this MEV transaction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-gray-300 cursor-help">{item.cost}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Gas cost for this transaction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
