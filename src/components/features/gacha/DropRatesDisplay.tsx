interface DropRatesDisplayProps {
  legendaryRate: string
  epicRate: string
  rareRate: string
  commonRate: string
}

export function DropRatesDisplay({
  legendaryRate,
  epicRate,
  rareRate,
  commonRate,
}: DropRatesDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm">
        <strong>Drop Rates:</strong>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Legendary:</span>{" "}
          <span className="font-medium">
            {(parseFloat(legendaryRate) * 100).toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-gray-600">Epic:</span>{" "}
          <span className="font-medium">
            {(parseFloat(epicRate) * 100).toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-gray-600">Rare:</span>{" "}
          <span className="font-medium">
            {(parseFloat(rareRate) * 100).toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-gray-600">Common:</span>{" "}
          <span className="font-medium">
            {(parseFloat(commonRate) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
