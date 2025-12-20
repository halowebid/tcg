import { z } from "zod"

import {
  insertSystemSettingsSchema,
} from "."

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be less than 50 characters")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .optional(),
})

// Card form schema - matches tRPC cards.create input
export const cardFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  setId: z.string().uuid().optional(),
  attackPower: z.number().int().min(0, "Attack power must be 0 or greater").optional(),
  defensePower: z.number().int().min(0, "Defense power must be 0 or greater").optional(),
  marketValue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid number")
    .optional(),
  dropWeight: z.string().optional(),
})

// Card edit form schema - all fields optional for update
export const cardEditFormSchema = cardFormSchema.partial()

export const gachaEventFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  bannerUrl: z.string().url("Must be a valid URL"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  packPriceCoins: z.number().int().positive("Price must be greater than 0"),
  packPriceGems: z.number().int().positive("Price must be greater than 0").optional(),
  commonRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
  rareRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
  epicRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
  legendaryRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
})

export const systemSettingsFormSchema = insertSystemSettingsSchema.extend({
  gameTitle: z
    .string()
    .min(1, "Game title is required")
    .max(100, "Must be less than 100 characters"),
  supportEmail: z.string().email("Must be a valid email address"),
  currencyName: z
    .string()
    .min(1, "Currency name is required")
    .max(50, "Must be less than 50 characters"),
  premiumCurrencyName: z
    .string()
    .min(1, "Premium currency name is required")
    .max(50, "Must be less than 50 characters"),
  exchangeRate: z
    .number()
    .int()
    .positive("Exchange rate must be a positive number"),
})

export const walletUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  coinsChange: z.number().int(),
  gemsChange: z.number().int(),
  reason: z.string().min(1, "Reason is required"),
})

export const walletUpdateFormSchema = z.object({
  coinsChange: z.number().int(),
  gemsChange: z.number().int(),
  reason: z.string().min(1, "Reason is required"),
})

export const milestoneFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  requirementType: z.enum([
    "collection_size",
    "total_spend",
    "friend_count",
    "pulls_count",
    "login_streak",
  ]),
  requirementValue: z.number().int().positive("Requirement value must be positive"),
  rewardType: z.enum(["coins", "gems", "badge", "frame", "title"]),
  rewardValue: z.string().min(1, "Reward value is required"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type CardFormInput = z.infer<typeof cardFormSchema>
export type CardEditFormInput = z.infer<typeof cardEditFormSchema>
export type GachaEventFormInput = z.infer<typeof gachaEventFormSchema>
export type SystemSettingsFormInput = z.infer<typeof systemSettingsFormSchema>
export type WalletUpdateInput = z.infer<typeof walletUpdateSchema>
export type WalletUpdateFormInput = z.infer<typeof walletUpdateFormSchema>
export type MilestoneFormInput = z.infer<typeof milestoneFormSchema>
