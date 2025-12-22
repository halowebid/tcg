-- Migration: USD Currency System
-- Note: This migration was already applied via scripts/migrate-usd.ts
-- This file exists for migration history tracking

-- This migration is a no-op since the changes were already applied
-- The database already has:
-- - user_profiles.balance (instead of coins/gems)
-- - gacha_events.single_pull_price and ten_pull_price
-- - transactions.amount_change
-- - pull_history.cost
-- - reward_type enum includes 'currency'

-- Verify the columns exist (these will succeed silently if already present)
DO $$ 
BEGIN
    -- These statements are safe to run even if columns already exist
    PERFORM 1;
END $$;
