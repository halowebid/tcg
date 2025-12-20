import { adminRouter } from "./routers/admin"
import { cardSetsRouter } from "./routers/card-sets"
import { cardsRouter } from "./routers/cards"
import { collectionRouter } from "./routers/collection"
import { gachaRouter } from "./routers/gacha"
import { itemRouter } from "./routers/item"
import { marketplaceRouter } from "./routers/marketplace"
import { milestonesRouter } from "./routers/milestones"
import { notificationsRouter } from "./routers/notifications"
import { settingsRouter } from "./routers/settings"
import { usersRouter } from "./routers/users"
import { router } from "./trpc"

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
  notifications: notificationsRouter,
  settings: settingsRouter,
})

export type AppRouter = typeof appRouter
