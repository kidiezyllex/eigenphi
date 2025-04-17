import { Suspense } from "react"
import MevLiveStream from "@/components/LiveStreamPage/MevLiveStream"
import MevLiveStreamSkeleton from "@/components/LiveStreamPage/MevLiveStreamSkeleton"

export default function MevEthereumTxrPage() {
  return (
    <div className="flex flex-col min-h-screen bg-mainDarkBackgroundV1">
      <main className="flex-1 bg-mainDarkBackgroundV1">
        <Suspense fallback={<MevLiveStreamSkeleton />}>
          <MevLiveStream />
        </Suspense>
      </main>
    </div>
  )
}
