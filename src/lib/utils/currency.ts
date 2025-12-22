/**
 * Currency formatting utilities for USD amounts
 */

export function formatUSD(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "$0.00"
  }

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount

  if (isNaN(numAmount) || !isFinite(numAmount)) {
    return "$0.00"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
}

export function parseUSD(value: string | number): number {
  if (typeof value === "number") {
    return isNaN(value) || !isFinite(value) ? 0 : value
  }

  const cleanValue = value.replace(/[$,\s]/g, "")

  const parsed = parseFloat(cleanValue)
  return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed
}

export function isValidUSD(value: string | number): boolean {
  const parsed = parseUSD(value)
  return parsed >= 0 && isFinite(parsed)
}

export function roundUSD(amount: number): number {
  return Math.round(amount * 100) / 100
}
