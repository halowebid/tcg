import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const systemSettings = pgTable("system_settings", {
  id: text("id").primaryKey().default("default"),
  gameTitle: text("game_title").notNull().default("TCG Gacha System"),
  supportEmail: text("support_email")
    .notNull()
    .default("support@tcg-gacha.com"),
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),
  currencyName: text("currency_name").notNull().default("Coins"),
  premiumCurrencyName: text("premium_currency_name").notNull().default("Gems"),
  exchangeRate: integer("exchange_rate").notNull().default(100),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
