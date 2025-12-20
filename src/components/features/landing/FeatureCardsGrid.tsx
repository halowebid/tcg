import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui"

const features = [
  {
    title: "Gacha System",
    description: "Pull random cards with different rarity rates",
    content:
      "Experience the thrill of pulling legendary cards from our gacha events. Each event features unique rates and featured cards.",
  },
  {
    title: "Marketplace",
    description: "Buy and sell cards with other players",
    content:
      "Browse the marketplace to find the perfect cards for your collection. Purchase cards using in-game currency.",
  },
  {
    title: "Collection",
    description: "Build your ultimate card collection",
    content:
      "View and manage your card collection. Track your progress and aim for 100% completion.",
  },
]

export function FeatureCardsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              {feature.title}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {feature.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>{feature.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
