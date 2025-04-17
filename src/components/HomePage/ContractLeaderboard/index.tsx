"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface ContractLeaderboardProps {
  data: {
    id: string
    contract: string
    contractShort: string
    types: string[]
    profit: string
    profitValue: number
    cost: string
    badge?: string
  }[]
}

export function ContractLeaderboard({ data }: ContractLeaderboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {data.map((item, index) => (
        <motion.div
          key={item.id}
          className="p-4 bg-mainBackgroundV1 border border-[#252631] rounded-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-700"></div>
              <span className="text-sm text-gray-300">{item.contractShort}</span>
              {item.badge && (
                <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4">
                  {item.badge}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            {item.types.map((type, i) => (
              <div key={i} className="flex items-center">
                <span className="text-gray-400 mr-1">
                  <i className={`iconfont icon-${type.toLowerCase()}`}></i>
                </span>
                <span className="text-xs text-gray-300">{type}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Profit:</span>
              <Badge
                variant="outline"
                className={`text-sm font-medium bg-mainCardV1 border border-mainCardV1 flex-shrink-0 ${
                  item.profitValue > 500000
                    ? "text-[#F44369]"
                    : item.profitValue > 100000
                      ? "text-[#FFA800]"
                      : "text-white"
                }`}
              >
                <span className="text-nowrap">{item.profit}</span>
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Cost:</span>
              <span className="text-xs text-gray-500">{item.cost}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
