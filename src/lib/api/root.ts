import { router } from "./trpc"
import { cardsRouter } from "./routers/cards"
import { cardSetsRouter } from "./routers/card-sets"
import { gachaRouter } from "./routers/gacha"
import { collectionRouter } from "./routers/collection"
import { marketplaceRouter } from "./routers/marketplace"
import { usersRouter } from "./routers/users"
import { milestonesRouter } from "./routers/milestones"
import { adminRouter } from "./routers/admin"
import { itemRouter } from "./routers/item"

export const appRouter = router({
  cards: cardsRouter,
  cardSets: cardSetsRouter,
  gacha: gachaRouter,
  collection: collectionRouter,
  marketplace: marketplaceRouter,
  users: usersRouter,
  milestones: milestonesRouter,
  admin: adminRouter,
  item: itemRouter,
})

export type AppRouter = typeof appRouter

