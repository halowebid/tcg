export const CACHE_KEYS = {
  CARDS_LIST: (page: number, rarity?: string, setId?: string) =>
    `cards:list:${page}:${rarity ?? "all"}:${setId ?? "all"}`,
  CARD_DETAILS: (id: string) => `cards:details:${id}`,
  ACTIVE_EVENTS: "events:active",
  EVENT_DETAILS: (id: string) => `events:details:${id}`,
  USER_COLLECTION: (userId: string) => `user:collection:${userId}`,
  USER_WALLET: (userId: string) => `user:wallet:${userId}`,
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_CART: (userId: string) => `user:cart:${userId}`,
  ADMIN_DASHBOARD_STATS: "admin:stats:dashboard",
  MARKETPLACE_LIST: (filters: string) => `marketplace:list:${filters}`,
  MILESTONES_LIST: "milestones:list",
  USER_MILESTONES: (userId: string) => `user:milestones:${userId}`,
}

export const CACHE_TTL = {
  CARDS_LIST: 300,
  CARD_DETAILS: 600,
  ACTIVE_EVENTS: 60,
  EVENT_DETAILS: 300,
  USER_COLLECTION: 30,
  USER_WALLET: 30,
  USER_PROFILE: 300,
  USER_CART: 300, // 5 minutes
  ADMIN_DASHBOARD: 120,
  MARKETPLACE: 60,
  MILESTONES: 300,
}
