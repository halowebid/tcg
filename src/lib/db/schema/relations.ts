import { relations } from "drizzle-orm"

import { cards } from "./cards"
import { userCards } from "./user-cards"
import { users } from "./users"
import { userProfiles } from "./user-profiles"

export const cardsRelations = relations(cards, ({ many }) => ({
  userCards: many(userCards),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  userCards: many(userCards),
}))

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}))
