"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface TreemapChartProps {
  data: any
}

interface TreemapItem {
  name: string
  value: string
  style: React.CSSProperties
  bgColor: string
}

export function TreemapChart({ data }: TreemapChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    name: string
    value: string
    opacity: number
  }>({
    visible: false,
    x: 0,
    y: 0,
    name: "",
    value: "",
    opacity: 0
  })
  
  const [chartItems, setChartItems] = useState<TreemapItem[]>([
    {
      name: "USDC",
      value: "$1,272,714,748.43",
      style: { top: 0, left: 0, width: "40%", height: "40%" },
      bgColor: "#4DC3E2"
    },
    {
      name: "WETH",
      value: "$987,654,321.12",
      style: { top: 0, right: 0, width: "60%", height: "40%" },
      bgColor: "#8478E3"
    },
    {
      name: "USDT",
      value: "$876,543,210.98",
      style: { bottom: 0, left: 0, width: "40%", height: "60%" },
      bgColor: "#58A3E4"
    },
    {
      name: "WBTC",
      value: "$543,210,987.65",
      style: { bottom: 0, right: 0, width: "30%", height: "30%" },
      bgColor: "#AD76E3"
    },
    {
      name: "DAI",
      value: "$321,098,765.43",
      style: { bottom: 0, right: "30%", width: "30%", height: "30%" },
      bgColor: "#6083E3"
    },
    {
      name: "LBTC",
      value: "$210,987,654.32",
      style: { bottom: "30%", right: 0, width: "15%", height: "30%" },
      bgColor: "#F06C71"
    },
    {
      name: "USDe",
      value: "$109,876,543.21",
      style: { bottom: "30%", right: "15%", width: "15%", height: "30%" },
      bgColor: "#EE916F"
    }
  ])

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, item: TreemapItem) => {
    if (!chartRef.current) return
    
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    const chartRect = chartRef.current.getBoundingClientRect()

    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2 - chartRect.left,
      y: rect.top + rect.height / 2 - chartRect.top,
      name: item.name,
      value: item.value,
      opacity: 1
    })
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ 
      ...prev, 
      opacity: 0.5,
      name: "Select a token",
      value: "To view value"
    }))
  }

  useEffect(() => {
    setTooltip(prev => ({
      ...prev,
      visible: true,
      opacity: 0.5,
      name: "Select a token",
      value: "To view value"
    }))
  }, [])

  useEffect(() => {
  }, [data])

  return (
    <motion.div
      ref={chartRef}
      className="w-full h-[300px] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {chartItems.map((item, index) => (
        <div
          key={index}
          className="absolute border border-white flex items-center justify-center text-white text-xs"
          style={{
            ...item.style,
            backgroundColor: item.bgColor,
            position: "absolute"
          }}
          onMouseEnter={(e) => handleMouseEnter(e, item)}
          onMouseLeave={handleMouseLeave}
        >
          {item.name}
        </div>
      ))}
      
      {tooltip.visible && (
        <div
          className="absolute z-10 bg-white/90 border border-blue-500 rounded-none shadow-lg p-2 text-xs"
          style={{
            left: `${tooltip.x || 150}px`,
            top: `${tooltip.y || 150}px`,
            transform: "translate(-50%, -50%)",
            transition: "all 200ms ease-in-out"
          }}
        >
          <div className="font-bold mb-1 text-center">{tooltip.name}</div>
          <div className="text-center font-normal text-mainGrayV1">{tooltip.value}</div>
          <div className="absolute left-1/2 bottom-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/90 -translate-x-1/2 translate-y-[6px]"></div>
        </div>
      )}
    </motion.div>
  )
}
