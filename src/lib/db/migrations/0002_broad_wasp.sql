CREATE TABLE "system_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"game_title" text DEFAULT 'TCG Gacha System' NOT NULL,
	"support_email" text DEFAULT 'support@tcg-gacha.com' NOT NULL,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"currency_name" text DEFAULT 'Coins' NOT NULL,
	"premium_currency_name" text DEFAULT 'Gems' NOT NULL,
	"exchange_rate" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
