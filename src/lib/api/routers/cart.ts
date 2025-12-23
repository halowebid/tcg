import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys"
import { getCached, invalidatePattern, setCached } from "@/lib/cache/redis"
import {
  cards,
  cartItems,
  transactions,
  userCards,
  userProfiles,
} from "@/lib/db/schema"
import { protectedProcedure, router } from "../trpc"

export const cartRouter = router({
  getItems: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const cacheKey = CACHE_KEYS.USER_CART(userId)

    const cached = await getCached(cacheKey)
    if (cached) {
      return cached
    }

    const items = await ctx.db.query.cartItems.findMany({
      where: eq(cartItems.userId, userId),
      with: {
        card: true,
      },
    })

    const totalPrice = items.reduce((sum, item) => {
      const price = item.card.marketValue
        ? parseFloat(item.card.marketValue)
        : 0
      return sum + price
    }, 0)

    const result = {
      items: items.map((item) => ({
        id: item.id,
        cardId: item.card.id,
        name: item.card.name,
        imageUrl: item.card.imageUrl,
        rarity: item.card.rarity,
        price: item.card.marketValue ? parseFloat(item.card.marketValue) : 0,
        addedAt: item.addedAt,
      })),
      totalPrice,
      itemCount: items.length,
    }

    await setCached(cacheKey, result, CACHE_TTL.USER_CART)

    return result
  }),

  addItem: protectedProcedure
    .input(z.object({ cardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const card = await ctx.db.query.cards.findFirst({
        where: eq(cards.id, input.cardId),
      })

      if (!card) {
        throw new Error("Card not found")
      }

      if (!card.isActive) {
        throw new Error("Card is not available for purchase")
      }

      const existingItem = await ctx.db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.userId, userId),
          eq(cartItems.cardId, input.cardId),
        ),
      })

      if (existingItem) {
        return { success: true, message: "Item already in cart" }
      }

      await ctx.db.insert(cartItems).values({
        userId,
        cardId: input.cardId,
      })

      await invalidatePattern(CACHE_KEYS.USER_CART(userId))

      return { success: true, message: "Item added to cart" }
    }),

  removeItem: protectedProcedure
    .input(z.object({ cardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      await ctx.db
        .delete(cartItems)
        .where(
          and(eq(cartItems.userId, userId), eq(cartItems.cardId, input.cardId)),
        )

      await invalidatePattern(CACHE_KEYS.USER_CART(userId))

      return { success: true }
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id

    await ctx.db.delete(cartItems).where(eq(cartItems.userId, userId))

    await invalidatePattern(CACHE_KEYS.USER_CART(userId))

    return { success: true }
  }),

  validate: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const items = await ctx.db.query.cartItems.findMany({
      where: eq(cartItems.userId, userId),
      with: {
        card: true,
      },
    })

    const errors: string[] = []
    const validItems = items.filter((item) => {
      if (!item.card.isActive) {
        errors.push(`${item.card.name} is no longer available`)
        return false
      }
      return true
    })

    const totalPrice = validItems.reduce((sum, item) => {
      const price = item.card.marketValue
        ? parseFloat(item.card.marketValue)
        : 0
      return sum + price
    }, 0)

    return {
      valid: errors.length === 0,
      items: validItems.map((item) => ({
        id: item.id,
        cardId: item.card.id,
        name: item.card.name,
        price: item.card.marketValue ? parseFloat(item.card.marketValue) : 0,
      })),
      totalPrice,
      errors,
    }
  }),

  checkout: protectedProcedure
    .input(
      z.object({
        paymentMethod: z.enum(["wallet", "gateway"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const items = await ctx.db.query.cartItems.findMany({
        where: eq(cartItems.userId, userId),
        with: {
          card: true,
        },
      })

      if (items.length === 0) {
        throw new Error("Cart is empty")
      }

      const inactiveCards = items.filter((item) => !item.card.isActive)
      if (inactiveCards.length > 0) {
        throw new Error(
          `Some cards are no longer available: ${inactiveCards.map((i) => i.card.name).join(", ")}`,
        )
      }

      const totalPrice = items.reduce((sum, item) => {
        const price = item.card.marketValue
          ? parseFloat(item.card.marketValue)
          : 0
        return sum + price
      }, 0)

      if (input.paymentMethod === "wallet") {
        const profile = await ctx.db.query.userProfiles.findFirst({
          where: eq(userProfiles.userId, userId),
        })

        if (!profile) {
          throw new Error("Profile not found")
        }

        if (parseFloat(profile.balance) < totalPrice) {
          throw new Error("Insufficient balance")
        }

        await ctx.db.transaction(async (tx) => {
          await tx
            .update(userProfiles)
            .set({
              balance: (parseFloat(profile.balance) - totalPrice).toFixed(2),
              updatedAt: new Date(),
            })
            .where(eq(userProfiles.userId, userId))

          for (const item of items) {
            await tx.insert(userCards).values({
              userId,
              cardId: item.cardId,
              acquiredVia: "purchase",
            })
          }

          await tx.insert(transactions).values({
            userId,
            type: "card_purchase",
            amountChange: (-totalPrice).toFixed(2),
            description: `Purchased ${items.length} card(s) from cart`,
          })

          await tx.delete(cartItems).where(eq(cartItems.userId, userId))
        })

        await Promise.all([
          invalidatePattern(CACHE_KEYS.USER_CART(userId)),
          invalidatePattern(CACHE_KEYS.USER_WALLET(userId)),
          invalidatePattern(CACHE_KEYS.USER_COLLECTION(userId)),
        ])

        return {
          success: true,
          purchasedCards: items.map((item) => ({
            id: item.card.id,
            name: item.card.name,
          })),
        }
      }

      await ctx.db.transaction(async (tx) => {
        for (const item of items) {
          await tx.insert(userCards).values({
            userId,
            cardId: item.cardId,
            acquiredVia: "purchase",
          })
        }

        await tx.insert(transactions).values({
          userId,
          type: "card_purchase",
          amountChange: totalPrice.toFixed(2),
          description: `Purchased ${items.length} card(s) from cart via gateway`,
        })

        await tx.delete(cartItems).where(eq(cartItems.userId, userId))
      })

      await Promise.all([
        invalidatePattern(CACHE_KEYS.USER_CART(userId)),
        invalidatePattern(CACHE_KEYS.USER_COLLECTION(userId)),
      ])

      return {
        success: true,
        purchasedCards: items.map((item) => ({
          id: item.card.id,
          name: item.card.name,
        })),
      }
    }),
})
