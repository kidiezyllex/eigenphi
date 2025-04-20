"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface TransactionLeaderboardProps {
  data: {
    id: string
    type: string
    tokens: string[]
    tokenIcons: string[]
    locations: number
    contract: string
    contractShort: string
    profit: string
    date: string
  }[]
}

export function TransactionLeaderboard({ data }: TransactionLeaderboardProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-gray-400">
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Contract</th>
            <th className="text-right p-2">Profit</th>
            <th className="text-right p-2">Time(UTC)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <motion.tr
              key={item.id}
              className="border-b border-[#252631] hover:bg-[#25262B] cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <td className="p-2">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">
                    <i className={`iconfont icon-${item.type.toLowerCase()}`}></i>
                  </span>
                  <span className="text-xs text-gray-300">{item.type}</span>
                  <div className="flex ml-1">
                    {item.tokenIcons.map((icon, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full overflow-hidden -ml-1 first:ml-0 border border-[#1A1B1E]"
                      >
                        <Image
                          src={icon}
                          alt={item.tokens[i] || "token"}
                          width={16}
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4">
                    <span className="text-gray-400 mr-1">
                      <i className="iconfont icon-location"></i>
                    </span>
                    {item.locations}
                  </Badge>
                </div>
              </td>
              <td className="p-2">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-700"></div>
                  <span className="text-xs text-gray-300">{item.contractShort}</span>
                </div>
              </td>
              <td className="p-2 text-right">
                <span className="text-xs text-gray-300">{item.profit}</span>
              </td>
              <td className="p-2 text-right">
                <Badge variant="outline" className="text-[10px] py-0 h-4">
                  {item.date}
                </Badge>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
