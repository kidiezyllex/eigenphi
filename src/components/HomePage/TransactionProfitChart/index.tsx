"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface TransactionProfitChartProps {
  data: any
}

export function TransactionProfitChart({ data }: TransactionProfitChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    range: string
    value: string
  }>({
    visible: false,
    x: 0,
    y: 0,
    range: "",
    value: "",
  })

  // Làm sạch timeout khi component unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && chartRef.current) {
      const renderChart = () => {
        if (!chartRef.current) return

        chartRef.current.innerHTML = `
          <svg width="100%" height="350" viewBox="0 0 600 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Grid lines -->
            <line x1="0" y1="50" x2="600" y2="50" stroke="#2C2E33" strokeWidth="1" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#2C2E33" strokeWidth="1" />
            <line x1="0" y1="150" x2="600" y2="150" stroke="#2C2E33" strokeWidth="1" />
            <line x1="0" y1="200" x2="600" y2="200" stroke="#2C2E33" strokeWidth="1" />
            <line x1="0" y1="250" x2="600" y2="250" stroke="#2C2E33" strokeWidth="1" />
            
            <!-- X-axis -->
            <line x1="50" y1="250" x2="550" y2="250" stroke="#868E96" strokeWidth="1" />
            
            <!-- Y-axis -->
            <line x1="50" y1="50" x2="50" y2="250" stroke="#868E96" strokeWidth="1" />
            
            <!-- Hover areas for tooltips -->
            <g class="hover-areas">
              <rect x="100" y="0" width="30" height="250" fill="transparent" data-range="$-100k" data-value="0.0001" />
              <rect x="140" y="0" width="30" height="250" fill="transparent" data-range="$-10k" data-value="0.0001" />
              <rect x="180" y="0" width="30" height="250" fill="transparent" data-range="$-1k" data-value="0.0001" />
              <rect x="220" y="0" width="30" height="250" fill="transparent" data-range="$-100" data-value="0.0001" />
              <rect x="260" y="0" width="30" height="250" fill="transparent" data-range="$-10" data-value="0.0800" />
              <rect x="300" y="0" width="30" height="250" fill="transparent" data-range="$0" data-value="0.9000" />
              <rect x="340" y="0" width="30" height="250" fill="transparent" data-range="$10" data-value="0.0300" />
              <rect x="380" y="0" width="30" height="250" fill="transparent" data-range="$100" data-value="0.0100" />
              <rect x="420" y="0" width="30" height="250" fill="transparent" data-range="$1k" data-value="0.0001" />
              <rect x="460" y="0" width="30" height="250" fill="transparent" data-range="$10k" data-value="0.0001" />
              <rect x="500" y="0" width="30" height="250" fill="transparent" data-range="$100k" data-value="0.0001" />
            </g>
            
            <!-- Bars -->
            <rect x="100" y="249" width="30" height="1" fill="#009CFA" />
            <rect x="140" y="249" width="30" height="1" fill="#009CFA" />
            <rect x="180" y="249" width="30" height="1" fill="#009CFA" />
            <rect x="220" y="249" width="30" height="1" fill="#009CFA" />
            <rect x="260" y="230" width="30" height="20" fill="#009CFA" />
            <rect x="300" y="80" width="30" height="170" fill="#009CFA" />
            <rect x="340" y="240" width="30" height="10" fill="#009CFA" />
            <rect x="380" y="248" width="30" height="2" fill="#009CFA" />
            <rect x="420" y="249" width="30" height="1" fill="#009CFA" />
            <rect x="460" y="249" width="30" height="1" fill="#009CFA" />
            <rect x="500" y="249" width="30" height="1" fill="#009CFA" />
            
            <!-- X-axis labels -->
            <text x="115" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 115, 290)">$-100k</text>
            <text x="155" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 155, 290)">$-10k</text>
            <text x="195" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 195, 290)">$-1k</text>
            <text x="235" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 235, 290)">$-100</text>
            <text x="275" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 275, 290)">$-10</text>
            <text x="315" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 315, 290)">$0</text>
            <text x="355" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 355, 290)">$10</text>
            <text x="395" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 395, 290)">$100</text>
            <text x="435" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 435, 290)">$1k</text>
            <text x="475" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 475, 290)">$10k</text>
            <text x="515" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 515, 290)">$100k</text>
            
            <!-- Y-axis labels -->
            <text x="45" y="250" textAnchor="end" fill="#666666" fontSize="10">0</text>
            <text x="45" y="200" textAnchor="end" fill="#666666" fontSize="10">0.25</text>
            <text x="45" y="150" textAnchor="end" fill="#666666" fontSize="10">0.5</text>
            <text x="45" y="100" textAnchor="end" fill="#666666" fontSize="10">0.75</text>
            <text x="45" y="50" textAnchor="end" fill="#666666" fontSize="10">1</text>
            
            <!-- Y-axis title -->
            <text x="20" y="150" textAnchor="middle" fill="#666666" fontSize="10" transform="rotate(-90, 20, 150)">PDF of Transactions' Profit</text>
          </svg>
        `

        // Xử lý hover cho SVG
        const handleChartMouseMove = (e: MouseEvent) => {
          const svgElement = chartRef.current?.querySelector("svg")
          if (!svgElement) return

          // Lấy tọa độ chuột trong SVG
          const svgRect = svgElement.getBoundingClientRect()
          const mouseX = e.clientX - svgRect.left

          // Tìm hover area dựa trên vị trí chuột
          const hoverAreas = Array.from(chartRef.current!.querySelectorAll(".hover-areas rect"))
          const hoverArea = hoverAreas.find((area) => {
            const rect = area.getBoundingClientRect()
            return (
              e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
            )
          }) as SVGRectElement | undefined

          if (hoverArea) {
            // Hủy timeout trước đó nếu có
            if (tooltipTimeoutRef.current) {
              clearTimeout(tooltipTimeoutRef.current)
              tooltipTimeoutRef.current = null
            }

            const chartRect = chartRef.current!.getBoundingClientRect()
            const rect = hoverArea.getBoundingClientRect()

            setTooltip({
              visible: true,
              x: rect.left + rect.width / 2 - chartRect.left,
              y: rect.top - chartRect.top + rect.height / 2,
              range: hoverArea.getAttribute("data-range") || "",
              value: hoverArea.getAttribute("data-value") || "",
            })
          }
        }

        const handleChartMouseLeave = () => {
          // Sử dụng timeout để tránh tắt tooltip ngay lập tức
          tooltipTimeoutRef.current = setTimeout(() => {
            setTooltip((prev) => ({ ...prev, visible: false }))
          }, 100)
        }

        // Thêm event listeners cho cả SVG
        const svgElement = chartRef.current.querySelector("svg")
        if (svgElement) {
          svgElement.addEventListener("mousemove", handleChartMouseMove)
          svgElement.addEventListener("mouseleave", handleChartMouseLeave)
        }
      }

      renderChart()

      const handleResize = () => {
        renderChart()
      }

      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)

        // Xóa event listeners khi unmount
        const svgElement = chartRef.current?.querySelector("svg")
        if (svgElement) {
          svgElement.removeEventListener("mousemove", () => {})
          svgElement.removeEventListener("mouseleave", () => {})
        }
      }
    }
  }, [data])

  return (
    <motion.div
      ref={chartRef}
      className="w-full h-[350px] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {tooltip.visible && (
        <div
          className="absolute z-10 bg-white/90 rounded-none border border-blue-500 shadow-lg p-2 text-xs pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="font-bold mb-1 text-center">{tooltip.range}</div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-blue-500 font-bold">PDF of Transactions' Profit:</span>
            <span className="font-bold">{tooltip.value}</span>
          </div>
          <div className="absolute left-1/2 bottom-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/90 -translate-x-1/2 translate-y-[6px]"></div>
        </div>
      )}
    </motion.div>
  )
}
