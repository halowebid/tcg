"use client"

import { createAuthClient } from "better-auth/react"

/* eslint-disable no-restricted-properties */
export const authClient = createAuthClient({
  baseURL: process.env["NEXT_PUBLIC_APP_URL"]!,
})
/* eslint-enable no-restricted-properties */

export const { signIn, signOut, signUp, useSession } = authClient
