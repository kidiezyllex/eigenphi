"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface PerformanceChartProps {
  data: any
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    date: string
    arbitrage: string
    sandwich: string
    liquidation: string
    count: string
  }>({
    visible: false,
    x: 0,
    y: 0,
    date: "",
    arbitrage: "",
    sandwich: "",
    liquidation: "",
    count: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined" && chartRef.current) {
      const renderChart = () => {
        if (!chartRef.current) return

        chartRef.current.innerHTML = `
          <svg width="100%" height="360" viewBox="0 0 600 360" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Grid lines -->
            <line x1="0" y1="50" x2="600" y2="50" stroke="#2C2E33" strokeWidth="1" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#2C2E33" strokeWidth="1" />
            <line x1="0" y1="150" x2="600" y2="150" stroke="#2C2E33" strokeWidth="1" />
            <line x1="0" y1="200" x2="600" y2="200" stroke="#2C2E33" strokeWidth="1" />
            <line x1="0" y1="250" x2="600" y2="250" stroke="#2C2E33" strokeWidth="1" />
            
            <!-- X-axis -->
            <line x1="0" y1="250" x2="600" y2="250" stroke="#868E96" strokeWidth="1" />
            
            <!-- Y-axis -->
            <line x1="50" y1="0" x2="50" y2="250" stroke="#868E96" strokeWidth="1" />
            
            <!-- Hover areas for tooltips -->
            <g class="hover-areas" style="pointer-events: all;" transform="translate(0, 30)">
              <rect x="100" y="0" width="40" height="250" fill="transparent" data-date="11. Apr" data-arbitrage="$28,000" data-sandwich="$0" data-liquidation="$0" data-count="16,000" />
              <rect x="150" y="0" width="40" height="250" fill="transparent" data-date="12. Apr" data-arbitrage="$153,000" data-sandwich="$1,000" data-liquidation="$0" data-count="20,000" />
              <rect x="200" y="0" width="40" height="250" fill="transparent" data-date="13. Apr" data-arbitrage="$9,000" data-sandwich="$0" data-liquidation="$0" data-count="16,000" />
              <rect x="250" y="0" width="40" height="250" fill="transparent" data-date="14. Apr" data-arbitrage="$7,000" data-sandwich="$0" data-liquidation="$0" data-count="17,000" />
              <rect x="300" y="0" width="40" height="250" fill="transparent" data-date="15. Apr" data-arbitrage="$13,000" data-sandwich="$1,000" data-liquidation="$0" data-count="15,000" />
              <rect x="350" y="0" width="40" height="250" fill="transparent" data-date="16. Apr" data-arbitrage="$153,000" data-sandwich="$0" data-liquidation="$0" data-count="21,000" />
              <rect x="400" y="0" width="40" height="250" fill="transparent" data-date="17. Apr" data-arbitrage="$28,000" data-sandwich="$1,000" data-liquidation="$0" data-count="16,000" />
            </g>
            
            <!-- Arbitrage bars -->
            <rect x="100" y="150" width="20" height="100" fill="#009CFA" />
            <rect x="150" y="50" width="20" height="200" fill="#009CFA" />
            <rect x="200" y="180" width="20" height="70" fill="#009CFA" />
            <rect x="250" y="190" width="20" height="60" fill="#009CFA" />
            <rect x="300" y="170" width="20" height="80" fill="#009CFA" />
            <rect x="350" y="80" width="20" height="170" fill="#009CFA" />
            <rect x="400" y="160" width="20" height="90" fill="#009CFA" />
            
            <!-- Sandwich bars (smaller) -->
            <rect x="125" y="200" width="20" height="50" fill="#49CE87" />
            <rect x="175" y="220" width="20" height="30" fill="#49CE87" />
            <rect x="225" y="230" width="20" height="20" fill="#49CE87" />
            <rect x="275" y="240" width="20" height="10" fill="#49CE87" />
            <rect x="325" y="235" width="20" height="15" fill="#49CE87" />
            <rect x="375" y="245" width="20" height="5" fill="#49CE87" />
            <rect x="425" y="240" width="20" height="10" fill="#49CE87" />
            
            <!-- Count line -->
            <path d="M100 100 L150 60 L200 80 L250 70 L300 90 L350 50 L400 85 L450 75" stroke="#A370FF" strokeWidth="2" fill="none" />
            
            <!-- Count points -->
            <circle cx="100" cy="100" r="4" fill="#A370FF" />
            <circle cx="150" cy="60" r="4" fill="#A370FF" />
            <circle cx="200" cy="80" r="4" fill="#A370FF" />
            <circle cx="250" cy="70" r="4" fill="#A370FF" />
            <circle cx="300" cy="90" r="4" fill="#A370FF" />
            <circle cx="350" cy="50" r="4" fill="#A370FF" />
            <circle cx="400" cy="85" r="4" fill="#A370FF" />
            <circle cx="450" cy="75" r="4" fill="#A370FF" />
            
            <!-- X-axis labels -->
            <text x="100" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 100, 290)">11. Apr</text>
            <text x="150" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 150, 290)">12. Apr</text>
            <text x="200" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 200, 290)">13. Apr</text>
            <text x="250" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 250, 290)">14. Apr</text>
            <text x="300" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 300, 290)">15. Apr</text>
            <text x="350" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 350, 290)">16. Apr</text>
            <text x="400" y="290" fill="#A6A7AB" fontSize="10" transform="rotate(-45, 400, 290)">17. Apr</text>
            
            <!-- Y-axis labels (left) -->
            <text x="45" y="250" textAnchor="end" fill="#717171" fontSize="10">0</text>
            <text x="45" y="200" textAnchor="end" fill="#717171" fontSize="10">250k</text>
            <text x="45" y="150" textAnchor="end" fill="#717171" fontSize="10">500k</text>
            <text x="45" y="100" textAnchor="end" fill="#717171" fontSize="10">750k</text>
            <text x="45" y="50" textAnchor="end" fill="#717171" fontSize="10">1,000k</text>
            
            <!-- Y-axis labels (right) -->
            <text x="555" y="250" textAnchor="start" fill="#A370FF" fontSize="10">0</text>
            <text x="555" y="200" textAnchor="start" fill="#A370FF" fontSize="10">5k</text>
            <text x="555" y="150" textAnchor="start" fill="#A370FF" fontSize="10">10k</text>
            <text x="555" y="100" textAnchor="start" fill="#A370FF" fontSize="10">15k</text>
            <text x="555" y="50" textAnchor="start" fill="#A370FF" fontSize="10">20k</text>
          </svg>
        `

        const hoverAreas = chartRef.current.querySelectorAll(".hover-areas rect")
        hoverAreas.forEach((area) => {
          area.addEventListener("mouseenter", (e) => {
            const target = e.target as SVGRectElement
            const rect = target.getBoundingClientRect()
            const chartRect = chartRef.current!.getBoundingClientRect()

            const xPos = rect.left + rect.width / 2 - chartRect.left
            const yPos = 30 // Đặt vị trí y cố định phía trên biểu đồ

            setTooltip({
              visible: true,
              x: xPos,
              y: yPos,
              date: target.getAttribute("data-date") || "",
              arbitrage: target.getAttribute("data-arbitrage") || "",
              sandwich: target.getAttribute("data-sandwich") || "",
              liquidation: target.getAttribute("data-liquidation") || "",
              count: target.getAttribute("data-count") || "",
            })
          })
        })

        // Thêm sự kiện mouseleave cho toàn bộ khu vực biểu đồ
        chartRef.current.addEventListener("mouseleave", () => {
          setTooltip((prev) => ({ ...prev, visible: false }))
        })
      }

      renderChart()

      const handleResize = () => {
        renderChart()
      }

      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
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
          className="absolute z-10 bg-white/90 border border-blue-500 rounded-none shadow-lg p-2 text-xs"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, 0)",
            transition: "all 150ms ease-in-out",
            pointerEvents: "none",
            maxWidth: "200px",
            minWidth: "150px",
          }}
        >
          <div className="font-bold mb-1 text-center">{tooltip.date} (UTC)</div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#009CFA] font-bold">Arbitrage:</span>
            <span className="font-normal text-mainGrayV1">{tooltip.arbitrage}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#49CE87] font-bold">Sandwich:</span>
            <span className="font-normal text-mainGrayV1">{tooltip.sandwich}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#FFC800] font-bold">Liquidation:</span>
            <span className="font-normal text-mainGrayV1">{tooltip.liquidation}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#A370FF] font-bold">Count:</span>
            <span className="font-normal text-mainGrayV1">{tooltip.count}</span>
          </div>
          <div className="absolute left-1/2 bottom-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/90 -translate-x-1/2 translate-y-[6px] hidden"></div>
        </div>
      )}
    </motion.div>
  )
}
