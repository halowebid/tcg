import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

/* eslint-disable no-restricted-properties */
const connectionString = process.env["DATABASE_URL"]!
/* eslint-enable no-restricted-properties */

const queryClient = postgres(connectionString)
export const db = drizzle(queryClient, { schema })

export const migrationClient = postgres(connectionString, { max: 1 })
