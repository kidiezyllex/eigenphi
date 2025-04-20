import { cn } from "@/lib/utils"

function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#373A40] dark:bg-slate-800 ${className}`}
      {...props}
    />
  )
}

export { Skeleton }
