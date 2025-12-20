import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui"
import { DropRatesDisplay } from "./DropRatesDisplay"
import { PullButtons } from "./PullButtons"

interface GachaEvent {
  id: string
  name: string
  description: string | null
  bannerUrl: string | null
  legendaryRate: string
  epicRate: string
  rareRate: string
  commonRate: string
  packPriceCoins: number
  packPriceGems: number | null
}

interface GachaEventCardProps {
  event: GachaEvent
  isSelected: boolean
  onSinglePull: (eventId: string) => void
  onTenPull: (eventId: string) => void
  isSinglePullPending: boolean
  isTenPullPending: boolean
}

export function GachaEventCard({
  event,
  isSelected,
  onSinglePull,
  onTenPull,
  isSinglePullPending,
  isTenPullPending,
}: GachaEventCardProps) {
  return (
    <Card className={isSelected ? "ring-2 ring-blue-600" : ""}>
      <CardHeader>
        <img
          src={event.bannerUrl ?? ""}
          alt={event.name}
          className="mb-4 h-32 w-full rounded-t-lg object-cover"
        />
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DropRatesDisplay
            legendaryRate={event.legendaryRate}
            epicRate={event.epicRate}
            rareRate={event.rareRate}
            commonRate={event.commonRate}
          />

          <PullButtons
            onSinglePull={() => onSinglePull(event.id)}
            onTenPull={() => onTenPull(event.id)}
            isSinglePullPending={isSinglePullPending}
            isTenPullPending={isTenPullPending}
            singlePullPrice={{
              coins: event.packPriceCoins,
              gems: event.packPriceGems ?? 0,
            }}
            tenPullPrice={{
              coins: event.packPriceCoins * 10,
              gems: (event.packPriceGems ?? 0) * 10,
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
