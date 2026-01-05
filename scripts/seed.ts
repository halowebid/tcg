import { eq } from "drizzle-orm"

import { auth } from "../src/lib/auth"
import { db } from "../src/lib/db"
import {
  cards,
  gachaEvents,
  userProfiles,
  users,
} from "../src/lib/db/schema"

async function seed() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data (only app-specific tables, not auth tables)
  console.log("🗑️  Clearing existing data...")
  
  // First, delete dependent tables
  await db.delete(gachaEvents)
  await db.delete(cards)
  
  // Note: We don't delete userProfiles, users, accounts, or sessions
  // as they are managed by better-auth and may cause FK constraint issues

  // Create admin user using better-auth
  console.log("👤 Creating admin user...")
  const adminEmail = "admin@tcg.com"
  const adminPassword = "admin123456"

  try {
    const adminUser = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Admin User",
      },
    })

    if (adminUser?.user?.id) {
      console.log(`✅ Admin user created with ID: ${adminUser.user.id}`)
      
      // Update user role to admin directly in database
      await db
        .update(users)
        .set({ role: "admin", emailVerified: true })
        .where(eq(users.id, adminUser.user.id))

      // Check if profile already exists
      const existingProfile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, adminUser.user.id))
        .limit(1)

      if (existingProfile.length === 0) {
        // Create admin profile
        await db.insert(userProfiles).values({
          userId: adminUser.user.id,
          username: "admin",
          displayName: "Admin",
          level: 99,
          exp: 999999,
          balance: "1000.00",
          isAdmin: true,
        })
        console.log("✅ Admin profile created successfully")
      } else {
        console.log("⚠️  Admin profile already exists, skipping...")
      }
    }
  } catch (error: any) {
    console.log(`⚠️  Admin user creation failed: ${error?.message || "Unknown error"}`)
    console.log("Attempting to find existing admin user...")
    
    // Try to find existing admin user and ensure profile exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1)
    
    if (existingUser.length > 0) {
      console.log("✅ Found existing admin user")
      const userId = existingUser[0].id
      
      // Ensure user is admin and verified
      await db
        .update(users)
        .set({ role: "admin", emailVerified: true })
        .where(eq(users.id, userId))
      
      console.log("✅ Admin user updated")
      
      // Check if profile exists
      const existingProfile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1)
      
      if (existingProfile.length === 0) {
        await db.insert(userProfiles).values({
          userId: userId,
          username: "admin",
          displayName: "Admin",
          level: 99,
          exp: 999999,
          balance: "1000.00",
          isAdmin: true,
        })
        console.log("✅ Admin profile created for existing user")
      }
    }
  }

  // Create test user using better-auth
  console.log("👤 Creating test user...")
  const testEmail = "test@tcg.com"
  const testPassword = "test123456"

  try {
    const testUser = await auth.api.signUpEmail({
      body: {
        email: testEmail,
        password: testPassword,
        name: "Test User",
      },
    })

    if (testUser?.user?.id) {
      console.log(`✅ Test user created with ID: ${testUser.user.id}`)
      
      // Update email verified status
      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.id, testUser.user.id))

      // Check if profile already exists
      const existingProfile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, testUser.user.id))
        .limit(1)

      if (existingProfile.length === 0) {
        // Create test user profile
        await db.insert(userProfiles).values({
          userId: testUser.user.id,
          username: "testuser",
          displayName: "Test User",
          level: 5,
          exp: 1500,
          balance: "50.00",
          isAdmin: false,
        })
        console.log("✅ Test user profile created successfully")
      } else {
        console.log("⚠️  Test user profile already exists, skipping...")
      }
    }
  } catch (error: any) {
    console.log(`⚠️  Test user creation failed: ${error?.message || "Unknown error"}`)
    console.log("Attempting to find existing test user...")
    
    // Try to find existing test user and ensure profile exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail))
      .limit(1)
    
    if (existingUser.length > 0) {
      console.log("✅ Found existing test user")
      const userId = existingUser[0].id
      
      // Ensure user is verified
      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.id, userId))
      
      console.log("✅ Test user updated")
      
      // Check if profile exists
      const existingProfile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1)
      
      if (existingProfile.length === 0) {
        await db.insert(userProfiles).values({
          userId: userId,
          username: "testuser",
          displayName: "Test User",
          level: 5,
          exp: 1500,
          balance: "50.00",
          isAdmin: false,
        })
        console.log("✅ Test user profile created for existing user")
      }
    }
  }

  // Create cards
  console.log("🃏 Creating Pokemon cards...")
  const cardData = [
    // Legendary cards
    {
      name: "Charizard VMAX",
      description: "Gigantamax Charizard - The ultimate fire-breathing dragon",
      imageUrl:
        "https://images.pokemontcg.io/swsh4/20_hires.png",
      rarity: "legendary" as const,
      attackPower: 3300,
      defensePower: 2800,
      marketValue: "1500.00",
      dropWeight: "1.0",
    },
    {
      name: "Mewtwo GX",
      description: "The legendary psychic Pokemon with incredible power",
      imageUrl:
        "https://images.pokemontcg.io/sm35/72_hires.png",
      rarity: "legendary" as const,
      attackPower: 3100,
      defensePower: 3200,
      marketValue: "1400.00",
      dropWeight: "1.0",
    },
    {
      name: "Rayquaza VMAX",
      description: "Sky High Pokemon - Master of the atmosphere",
      imageUrl:
        "https://images.pokemontcg.io/swsh7/111_hires.png",
      rarity: "legendary" as const,
      attackPower: 3500,
      defensePower: 2700,
      marketValue: "1600.00",
      dropWeight: "0.8",
    },
    // Epic cards
    {
      name: "Pikachu VMAX",
      description: "The iconic Electric Mouse Pokemon at max power",
      imageUrl:
        "https://images.pokemontcg.io/swsh4/44_hires.png",
      rarity: "epic" as const,
      attackPower: 2700,
      defensePower: 2400,
      marketValue: "800.00",
      dropWeight: "1.2",
    },
    {
      name: "Gengar VMAX",
      description: "Shadow Pokemon that lurks in the darkness",
      imageUrl:
        "https://images.pokemontcg.io/swsh3/157_hires.png",
      rarity: "epic" as const,
      attackPower: 2600,
      defensePower: 2300,
      marketValue: "750.00",
      dropWeight: "1.1",
    },
    {
      name: "Lucario GX",
      description: "Aura Pokemon with powerful fighting abilities",
      imageUrl:
        "https://images.pokemontcg.io/sm9/122_hires.png",
      rarity: "epic" as const,
      attackPower: 2500,
      defensePower: 2800,
      marketValue: "820.00",
      dropWeight: "1.0",
    },
    {
      name: "Blastoise VMAX",
      description: "Shellfish Pokemon with devastating water attacks",
      imageUrl:
        "https://images.pokemontcg.io/swsh3/103_hires.png",
      rarity: "epic" as const,
      attackPower: 2800,
      defensePower: 2500,
      marketValue: "780.00",
      dropWeight: "1.1",
    },
    // Rare cards
    {
      name: "Raichu V",
      description: "Electric Pokemon evolved from Pikachu",
      imageUrl:
        "https://images.pokemontcg.io/swsh4/45_hires.png",
      rarity: "rare" as const,
      attackPower: 2000,
      defensePower: 1800,
      marketValue: "400.00",
      dropWeight: "1.3",
    },
    {
      name: "Venusaur V",
      description: "Seed Pokemon with powerful grass attacks",
      imageUrl:
        "https://images.pokemontcg.io/swsh3/1_hires.png",
      rarity: "rare" as const,
      attackPower: 1900,
      defensePower: 2200,
      marketValue: "380.00",
      dropWeight: "1.4",
    },
    {
      name: "Lapras V",
      description: "Transport Pokemon that glides through water",
      imageUrl:
        "https://images.pokemontcg.io/swsh2/49_hires.png",
      rarity: "rare" as const,
      attackPower: 1800,
      defensePower: 2100,
      marketValue: "420.00",
      dropWeight: "1.2",
    },
    {
      name: "Dragonite V",
      description: "Dragon Pokemon with incredible flying speed",
      imageUrl:
        "https://images.pokemontcg.io/swsh7/192_hires.png",
      rarity: "rare" as const,
      attackPower: 2100,
      defensePower: 1900,
      marketValue: "450.00",
      dropWeight: "1.1",
    },
    {
      name: "Corviknight V",
      description: "Raven Pokemon with powerful steel wings",
      imageUrl:
        "https://images.pokemontcg.io/swsh1/109_hires.png",
      rarity: "rare" as const,
      attackPower: 1850,
      defensePower: 2050,
      marketValue: "370.00",
      dropWeight: "1.3",
    },
    // Common cards
    {
      name: "Pikachu",
      description: "Everyone's favorite Electric Mouse Pokemon",
      imageUrl:
        "https://images.pokemontcg.io/swsh4/28_hires.png",
      rarity: "common" as const,
      attackPower: 1200,
      defensePower: 1100,
      marketValue: "50.00",
      dropWeight: "2.0",
    },
    {
      name: "Charmander",
      description: "Lizard Pokemon with a flame on its tail",
      imageUrl:
        "https://images.pokemontcg.io/swsh3/24_hires.png",
      rarity: "common" as const,
      attackPower: 1100,
      defensePower: 900,
      marketValue: "45.00",
      dropWeight: "2.1",
    },
    {
      name: "Squirtle",
      description: "Tiny Turtle Pokemon with water abilities",
      imageUrl:
        "https://images.pokemontcg.io/swsh3/36_hires.png",
      rarity: "common" as const,
      attackPower: 1000,
      defensePower: 1300,
      marketValue: "55.00",
      dropWeight: "1.9",
    },
    {
      name: "Bulbasaur",
      description: "Seed Pokemon with a bulb on its back",
      imageUrl:
        "https://images.pokemontcg.io/swsh1/1_hires.png",
      rarity: "common" as const,
      attackPower: 1050,
      defensePower: 1250,
      marketValue: "52.00",
      dropWeight: "2.0",
    },
    {
      name: "Eevee",
      description: "Evolution Pokemon with many possible evolutions",
      imageUrl:
        "https://images.pokemontcg.io/swsh1/125_hires.png",
      rarity: "common" as const,
      attackPower: 950,
      defensePower: 1050,
      marketValue: "40.00",
      dropWeight: "2.2",
    },
    {
      name: "Jigglypuff",
      description: "Balloon Pokemon known for its soothing song",
      imageUrl:
        "https://images.pokemontcg.io/swsh2/119_hires.png",
      rarity: "common" as const,
      attackPower: 800,
      defensePower: 1400,
      marketValue: "48.00",
      dropWeight: "1.8",
    },
    {
      name: "Psyduck",
      description: "Duck Pokemon always suffering from headaches",
      imageUrl:
        "https://images.pokemontcg.io/swsh2/58_hires.png",
      rarity: "common" as const,
      attackPower: 900,
      defensePower: 1100,
      marketValue: "42.00",
      dropWeight: "2.1",
    },
    {
      name: "Snorlax",
      description: "Sleeping Pokemon with enormous defensive power",
      imageUrl:
        "https://images.pokemontcg.io/swsh1/140_hires.png",
      rarity: "common" as const,
      attackPower: 850,
      defensePower: 1550,
      marketValue: "46.00",
      dropWeight: "2.0",
    },
  ]

  await db.insert(cards).values(cardData)

  // Create active gacha events
  console.log("🎰 Creating gacha events...")
  const now = new Date()
  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

  await db.insert(gachaEvents).values([
    {
      name: "Champion's Path",
      description:
        "The ultimate collection featuring powerful Champion Pokemon! Guaranteed Rare or higher in every pack.",
      bannerUrl:
        "https://images.pokemontcg.io/swsh35/logo.png",
      startDate: now,
      endDate: oneMonthFromNow,
      singlePullPrice: "5.00",
      tenPullPrice: "47.50",
      legendaryRate: "0.02",
      epicRate: "0.08",
      rareRate: "0.20",
      commonRate: "0.70",
      isActive: true,
    },
    {
      name: "Vivid Voltage",
      description:
        "Electrifying Pokemon cards with stunning artwork! Featuring powerful Electric-type Pokemon.",
      bannerUrl:
        "https://images.pokemontcg.io/swsh4/logo.png",
      startDate: now,
      endDate: twoWeeksFromNow,
      singlePullPrice: "4.50",
      tenPullPrice: "42.00",
      legendaryRate: "0.015",
      epicRate: "0.075",
      rareRate: "0.22",
      commonRate: "0.69",
      isActive: true,
    },
    {
      name: "Evolving Skies",
      description:
        "Soar to new heights with Dragon and Flying-type Pokemon! Rare Eeveelutions included.",
      bannerUrl:
        "https://images.pokemontcg.io/swsh7/logo.png",
      startDate: now,
      endDate: oneMonthFromNow,
      singlePullPrice: "6.00",
      tenPullPrice: "55.00",
      legendaryRate: "0.025",
      epicRate: "0.09",
      rareRate: "0.185",
      commonRate: "0.70",
      isActive: true,
    },
  ])

  console.log("✅ Database seeding completed!")
  console.log("\n📝 Login credentials:")
  console.log("Admin - Email: admin@tcg.com, Password: admin123456")
  console.log("Test User - Email: test@tcg.com, Password: test123456")

  process.exit(0)
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error)
  process.exit(1)
})
