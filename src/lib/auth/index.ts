import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verificationTokens,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env["GOOGLE_CLIENT_ID"] || "",
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] || "",
      enabled: !!process.env["GOOGLE_CLIENT_ID"],
    },
  },
  secret: process.env["BETTER_AUTH_SECRET"]!,
  baseURL: process.env["BETTER_AUTH_URL"]!,
  trustedOrigins: [process.env["NEXT_PUBLIC_APP_URL"]!],
})

export type Session = typeof auth.$Infer.Session
