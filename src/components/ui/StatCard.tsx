import {
  MinusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  type LucideIcon,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "./Card"

interface StatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon: IconComponent,
  trend,
  trendValue,
  className = "",
}: StatCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  }

  const trendIcons: Record<"up" | "down" | "neutral", LucideIcon> = {
    up: TrendingUpIcon,
    down: TrendingDownIcon,
    neutral: MinusIcon,
  }

  const TrendIcon = trend ? trendIcons[trend] : null

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {IconComponent && <IconComponent className="size-4 text-gray-600" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {TrendIcon && trendValue && (
          <div className={`flex items-center text-xs ${trendColors[trend!]}`}>
            <TrendIcon className="mr-1 size-4" />
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
