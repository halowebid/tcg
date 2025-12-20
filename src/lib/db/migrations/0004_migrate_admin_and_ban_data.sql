UPDATE users u
SET role = CASE 
  WHEN (SELECT is_admin FROM user_profiles WHERE user_id = u.id) THEN 'admin'
  ELSE 'user'
END;--> statement-breakpoint

UPDATE users u
SET 
  banned = COALESCE((SELECT is_banned FROM user_profiles WHERE user_id = u.id), false),
  ban_reason = CASE 
    WHEN (SELECT is_banned FROM user_profiles WHERE user_id = u.id) 
    THEN 'Migrated from legacy system' 
    ELSE NULL 
  END
WHERE EXISTS (SELECT 1 FROM user_profiles WHERE user_id = u.id);
