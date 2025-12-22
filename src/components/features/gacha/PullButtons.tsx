import { Button } from "@/components/ui"
import { formatUSD } from "@/lib/utils/currency"

interface PullButtonsProps {
  onSinglePull: () => void
  onTenPull: () => void
  isSinglePullPending: boolean
  isTenPullPending: boolean
  singlePullPrice: number
  tenPullPrice: number
}

export function PullButtons({
  onSinglePull,
  onTenPull,
  isSinglePullPending,
  isTenPullPending,
  singlePullPrice,
  tenPullPrice,
}: PullButtonsProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm">
        <div>Single Pull: {formatUSD(singlePullPrice)}</div>
        <div>10x Pull: {formatUSD(tenPullPrice)}</div>
      </div>
      <div className="mt-2 space-y-2">
        <Button
          className="w-full"
          onClick={onSinglePull}
          disabled={isSinglePullPending}
        >
          {isSinglePullPending ? "Pulling..." : "Single Pull"}
        </Button>
        <Button
          className="w-full"
          variant="primary"
          onClick={onTenPull}
          disabled={isTenPullPending}
        >
          {isTenPullPending ? "Pulling..." : "10x Pull"}
        </Button>
      </div>
    </div>
  )
}
