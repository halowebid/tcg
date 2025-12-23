CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"card_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;