import { Badge } from "./Badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./Card"

interface CardPreviewProps {
  id: string
  name: string
  description?: string
  imageUrl: string
  rarity: "common" | "rare" | "epic" | "legendary"
  attackPower?: number
  defensePower?: number
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

export function CardPreview({
  name,
  description,
  imageUrl,
  rarity,
  attackPower,
  defensePower,
  onClick,
  className = "",
  children,
}: CardPreviewProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={rarity}>{rarity.toUpperCase()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{name}</CardTitle>
        {description && (
          <CardDescription className="mt-1 line-clamp-2">
            {description}
          </CardDescription>
        )}
        {(attackPower !== undefined || defensePower !== undefined) && (
          <div className="mt-3 flex gap-4 text-sm">
            {attackPower !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-gray-600">ATK:</span>
                <span className="font-semibold">{attackPower}</span>
              </div>
            )}
            {defensePower !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-gray-600">DEF:</span>
                <span className="font-semibold">{defensePower}</span>
              </div>
            )}
          </div>
        )}
        {children && <div className="mt-3">{children}</div>}
      </CardContent>
    </Card>
  )
}
