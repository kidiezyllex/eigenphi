import type React from "react"
import { cn } from "@/lib/utils"

interface PaperProps {
  children: React.ReactNode
  className?: string
}

export function Paper({ children, className }: PaperProps) {
  return <div className={cn("bg-background rounded-md border shadow-sm", className)}>{children}</div>
}
