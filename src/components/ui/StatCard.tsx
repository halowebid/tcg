import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Icon } from "./Icon"

interface StatCardProps {
  title: string
  value: string | number
  icon?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  className = "",
}: StatCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  }

  const trendIcons = {
    up: "trending_up",
    down: "trending_down",
    neutral: "remove",
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <Icon name={icon} className="h-4 w-4 text-gray-600" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && trendValue && (
          <div className={`flex items-center text-xs ${trendColors[trend]}`}>
            <Icon name={trendIcons[trend]} className="mr-1 h-4 w-4" />
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
