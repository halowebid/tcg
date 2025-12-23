CREATE INDEX "cart_items_user_id_idx" ON "cart_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_items_card_id_idx" ON "cart_items" USING btree ("card_id");--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_card_id_unique" UNIQUE("user_id","card_id");