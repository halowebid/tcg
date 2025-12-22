import { hash } from "bcryptjs"

import { db } from "../src/lib/db"
import {
  accounts,
  cards,
  gachaEvents,
  userProfiles,
  users,
} from "../src/lib/db/schema"

async function seed() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data
  console.log("🗑️  Clearing existing data...")
  await db.delete(userProfiles)
  await db.delete(accounts)
  await db.delete(users)
  await db.delete(gachaEvents)
  await db.delete(cards)

  // Create admin user
  console.log("👤 Creating admin user...")
  const adminUserId = crypto.randomUUID()
  const adminPassword = await hash("admin123", 10)

  await db.insert(users).values({
    id: adminUserId,
    name: "Admin User",
    email: "admin@tcg.com",
    emailVerified: true,
    role: "admin",
  })

  await db.insert(accounts).values({
    id: crypto.randomUUID(),
    userId: adminUserId,
    accountId: "admin@tcg.com",
    providerId: "credential",
    password: adminPassword,
  })

  await db.insert(userProfiles).values({
    userId: adminUserId,
    username: "admin",
    displayName: "Admin",
    level: 99,
    exp: 999999,
    balance: "1000.00",
    isAdmin: true,
  })

  // Create test user
  console.log("👤 Creating test user...")
  const testUserId = crypto.randomUUID()
  const testPassword = await hash("test123", 10)

  await db.insert(users).values({
    id: testUserId,
    name: "Test User",
    email: "test@tcg.com",
    emailVerified: true,
    role: "user",
  })

  await db.insert(accounts).values({
    id: crypto.randomUUID(),
    userId: testUserId,
    accountId: "test@tcg.com",
    providerId: "credential",
    password: testPassword,
  })

  await db.insert(userProfiles).values({
    userId: testUserId,
    username: "testuser",
    displayName: "Test User",
    level: 5,
    exp: 1500,
    balance: "50.00",
    isAdmin: false,
  })

  // Create cards
  console.log("🃏 Creating cards...")
  const cardData = [
    // Legendary cards
    {
      name: "Celestial Dragon",
      description: "A mythical dragon that commands the stars",
      imageUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
      rarity: "legendary" as const,
      attackPower: 3500,
      defensePower: 3000,
      marketValue: "1500.00",
      dropWeight: "1.0",
    },
    {
      name: "Phoenix Emperor",
      description: "An immortal phoenix that rises from the ashes",
      imageUrl:
        "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400",
      rarity: "legendary" as const,
      attackPower: 3200,
      defensePower: 3300,
      marketValue: "1400.00",
      dropWeight: "1.0",
    },
    {
      name: "Void Keeper",
      description: "Guardian of the space between dimensions",
      imageUrl:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
      rarity: "legendary" as const,
      attackPower: 3600,
      defensePower: 2800,
      marketValue: "1600.00",
      dropWeight: "0.8",
    },
    // Epic cards
    {
      name: "Storm Wyvern",
      description: "A fierce wyvern that controls thunderstorms",
      imageUrl:
        "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400",
      rarity: "epic" as const,
      attackPower: 2800,
      defensePower: 2400,
      marketValue: "800.00",
      dropWeight: "1.2",
    },
    {
      name: "Shadow Assassin",
      description: "A master of stealth and deadly precision",
      imageUrl:
        "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400",
      rarity: "epic" as const,
      attackPower: 2600,
      defensePower: 2200,
      marketValue: "750.00",
      dropWeight: "1.1",
    },
    {
      name: "Crystal Guardian",
      description: "A mystical protector made of living crystal",
      imageUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
      rarity: "epic" as const,
      attackPower: 2400,
      defensePower: 2900,
      marketValue: "820.00",
      dropWeight: "1.0",
    },
    {
      name: "Flame Sorcerer",
      description: "A powerful mage wielding the fires of creation",
      imageUrl:
        "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400",
      rarity: "epic" as const,
      attackPower: 2700,
      defensePower: 2300,
      marketValue: "780.00",
      dropWeight: "1.1",
    },
    // Rare cards
    {
      name: "Thunder Knight",
      description: "A warrior blessed with the power of lightning",
      imageUrl:
        "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400",
      rarity: "rare" as const,
      attackPower: 2000,
      defensePower: 1800,
      marketValue: "400.00",
      dropWeight: "1.3",
    },
    {
      name: "Forest Druid",
      description: "A nature spirit in tune with the ancient woods",
      imageUrl:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
      rarity: "rare" as const,
      attackPower: 1700,
      defensePower: 2100,
      marketValue: "380.00",
      dropWeight: "1.4",
    },
    {
      name: "Ice Mage",
      description: "A frost wielder from the northern glaciers",
      imageUrl:
        "https://images.unsplash.com/photo-1483086431886-3590a88317fe?w=400",
      rarity: "rare" as const,
      attackPower: 1900,
      defensePower: 1700,
      marketValue: "420.00",
      dropWeight: "1.2",
    },
    {
      name: "Dark Paladin",
      description: "A fallen knight seeking redemption",
      imageUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
      rarity: "rare" as const,
      attackPower: 2100,
      defensePower: 1900,
      marketValue: "450.00",
      dropWeight: "1.1",
    },
    {
      name: "Wind Archer",
      description: "Swift and deadly with a bow",
      imageUrl:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
      rarity: "rare" as const,
      attackPower: 1800,
      defensePower: 1600,
      marketValue: "370.00",
      dropWeight: "1.3",
    },
    // Common cards
    {
      name: "Rookie Warrior",
      description: "A brave novice taking their first steps",
      imageUrl:
        "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400",
      rarity: "common" as const,
      attackPower: 1200,
      defensePower: 1100,
      marketValue: "50.00",
      dropWeight: "2.0",
    },
    {
      name: "Apprentice Mage",
      description: "A young student of the arcane arts",
      imageUrl:
        "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400",
      rarity: "common" as const,
      attackPower: 1100,
      defensePower: 900,
      marketValue: "45.00",
      dropWeight: "2.1",
    },
    {
      name: "Town Guard",
      description: "A stalwart defender of the people",
      imageUrl:
        "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400",
      rarity: "common" as const,
      attackPower: 1000,
      defensePower: 1300,
      marketValue: "55.00",
      dropWeight: "1.9",
    },
    {
      name: "Forest Scout",
      description: "A skilled tracker and pathfinder",
      imageUrl:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
      rarity: "common" as const,
      attackPower: 1300,
      defensePower: 1000,
      marketValue: "52.00",
      dropWeight: "2.0",
    },
    {
      name: "Market Vendor",
      description: "A shrewd trader with connections everywhere",
      imageUrl:
        "https://images.unsplash.com/photo-1483086431886-3590a88317fe?w=400",
      rarity: "common" as const,
      attackPower: 800,
      defensePower: 800,
      marketValue: "40.00",
      dropWeight: "2.2",
    },
    {
      name: "Village Healer",
      description: "A compassionate soul who mends wounds",
      imageUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
      rarity: "common" as const,
      attackPower: 600,
      defensePower: 1500,
      marketValue: "48.00",
      dropWeight: "1.8",
    },
    {
      name: "Traveling Bard",
      description: "A performer whose songs inspire courage",
      imageUrl:
        "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400",
      rarity: "common" as const,
      attackPower: 700,
      defensePower: 700,
      marketValue: "42.00",
      dropWeight: "2.1",
    },
    {
      name: "Stable Hand",
      description: "A hardworking soul with a way with animals",
      imageUrl:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
      rarity: "common" as const,
      attackPower: 900,
      defensePower: 1100,
      marketValue: "46.00",
      dropWeight: "2.0",
    },
  ]

  await db.insert(cards).values(cardData)

  // Create active gacha event
  console.log("🎰 Creating gacha event...")
  const now = new Date()
  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  await db.insert(gachaEvents).values({
    name: "Cosmic Legends",
    description:
      "Unleash the power of the stars. Each pack contains cards with a guaranteed Rare or higher.",
    bannerUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800",
    startDate: now,
    endDate: oneMonthFromNow,
    singlePullPrice: "5.00",
    tenPullPrice: "47.50",
    legendaryRate: "0.02",
    epicRate: "0.08",
    rareRate: "0.20",
    commonRate: "0.70",
    isActive: true,
  })

  console.log("✅ Database seeding completed!")
  console.log("\n📝 Login credentials:")
  console.log("Admin - Email: admin@tcg.com, Password: admin123")
  console.log("Test User - Email: test@tcg.com, Password: test123")

  process.exit(0)
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error)
  process.exit(1)
})
