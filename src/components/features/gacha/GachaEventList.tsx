import { GachaEventCard } from "./GachaEventCard"

interface GachaEvent {
  id: string
  name: string
  description: string | null
  bannerUrl: string | null
  legendaryRate: string
  epicRate: string
  rareRate: string
  commonRate: string
  singlePullPrice: number
  tenPullPrice: number
}

interface GachaEventListProps {
  events: GachaEvent[]
  selectedEventId: string | null
  onSinglePull: (eventId: string) => void
  onTenPull: (eventId: string) => void
  isSinglePullPending: boolean
  isTenPullPending: boolean
}

export function GachaEventList({
  events,
  selectedEventId,
  onSinglePull,
  onTenPull,
  isSinglePullPending,
  isTenPullPending,
}: GachaEventListProps) {
  if (events.length === 0) {
    return (
      <p className="text-center text-gray-600">
        No active gacha events at the moment.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <GachaEventCard
          key={event.id}
          event={event}
          isSelected={selectedEventId === event.id}
          onSinglePull={onSinglePull}
          onTenPull={onTenPull}
          isSinglePullPending={isSinglePullPending}
          isTenPullPending={isTenPullPending}
        />
      ))}
    </div>
  )
}
