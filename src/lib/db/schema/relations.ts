import { relations } from "drizzle-orm"

import { cards } from "./cards"
import { milestones } from "./milestones"
import { userCards } from "./user-cards"
import { userMilestones } from "./user-milestones"
import { userProfiles } from "./user-profiles"
import { users } from "./users"

export const cardsRelations = relations(cards, ({ many }) => ({
  userCards: many(userCards),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  userCards: many(userCards),
  userMilestones: many(userMilestones),
}))

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}))

export const milestonesRelations = relations(milestones, ({ many }) => ({
  userMilestones: many(userMilestones),
}))

export const userMilestonesRelations = relations(userMilestones, ({ one }) => ({
  user: one(users, {
    fields: [userMilestones.userId],
    references: [users.id],
  }),
  milestone: one(milestones, {
    fields: [userMilestones.milestoneId],
    references: [milestones.id],
  }),
}))
