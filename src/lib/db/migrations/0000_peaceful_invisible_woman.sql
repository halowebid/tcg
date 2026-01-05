CREATE TYPE "public"."rarity" AS ENUM('common', 'rare', 'epic', 'legendary');--> statement-breakpoint
CREATE TYPE "public"."acquired_via" AS ENUM('gacha', 'purchase', 'reward');--> statement-breakpoint
CREATE TYPE "public"."requirement_type" AS ENUM('collection_size', 'total_spend', 'friend_count', 'pulls_count', 'login_streak');--> statement-breakpoint
CREATE TYPE "public"."reward_type" AS ENUM('currency', 'badge', 'frame', 'title');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('gacha_pull', 'card_purchase', 'reward_claim', 'admin_adjustment', 'milestone_reward', 'deposit');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"id_token" text,
	"expires_at" timestamp,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"impersonated_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"exp" integer DEFAULT 0 NOT NULL,
	"balance" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"is_banned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"rarity" "rarity" DEFAULT 'common' NOT NULL,
	"set_id" uuid,
	"attack_power" integer,
	"defense_power" integer,
	"market_value" numeric(10, 2),
	"drop_weight" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "card_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"banner_url" text,
	"release_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"card_id" uuid NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"exp" integer DEFAULT 0 NOT NULL,
	"acquired_at" timestamp DEFAULT now() NOT NULL,
	"acquired_via" "acquired_via" DEFAULT 'purchase' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gacha_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"banner_url" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"single_pull_price" numeric(10, 2) NOT NULL,
	"ten_pull_price" numeric(10, 2) NOT NULL,
	"legendary_rate" numeric(5, 4) NOT NULL,
	"epic_rate" numeric(5, 4) NOT NULL,
	"rare_rate" numeric(5, 4) NOT NULL,
	"common_rate" numeric(5, 4) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_featured_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"rate_multiplier" numeric(5, 2) DEFAULT '2.0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pull_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"event_id" uuid,
	"card_id" uuid NOT NULL,
	"rarity_at_pull" text NOT NULL,
	"cost" numeric(10, 2),
	"pulled_at" timestamp DEFAULT now() NOT NULL,
	"session_id" uuid
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"requirement_type" "requirement_type" DEFAULT 'collection_size' NOT NULL,
	"requirement_value" integer NOT NULL,
	"reward_type" "reward_type" DEFAULT 'currency' NOT NULL,
	"reward_value" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"milestone_id" uuid NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"is_claimed" boolean DEFAULT false NOT NULL,
	"claimed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "transaction_type" DEFAULT 'card_purchase' NOT NULL,
	"amount_change" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"description" text NOT NULL,
	"reference_id" uuid,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"card_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cart_items_user_id_card_id_unique" UNIQUE("user_id","card_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"image_url" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"game_title" text DEFAULT 'TCG Gacha System' NOT NULL,
	"support_email" text DEFAULT 'support@tcg-gacha.com' NOT NULL,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_featured_cards" ADD CONSTRAINT "event_featured_cards_event_id_gacha_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."gacha_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_featured_cards" ADD CONSTRAINT "event_featured_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_history" ADD CONSTRAINT "pull_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_history" ADD CONSTRAINT "pull_history_event_id_gacha_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."gacha_events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_history" ADD CONSTRAINT "pull_history_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_milestones" ADD CONSTRAINT "user_milestones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_milestones" ADD CONSTRAINT "user_milestones_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification_tokens" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "cart_items_user_id_idx" ON "cart_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_items_card_id_idx" ON "cart_items" USING btree ("card_id");