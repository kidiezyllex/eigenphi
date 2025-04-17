import { Suspense } from "react"
import FlashloanDashboard from "@/components/FlashloanPage/FlashloanDashboard"
import FlashloanDashboardSkeleton from "@/components/FlashloanPage/FlashloanDashboardSkeleton"

export default function MevEthereumFlashloanPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense fallback={<FlashloanDashboardSkeleton />}>
        <FlashloanDashboard />
      </Suspense>
    </main>
  )
} 