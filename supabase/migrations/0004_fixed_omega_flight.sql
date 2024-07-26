DROP TABLE "test_table";--> statement-breakpoint
DROP TABLE "users_table";--> statement-breakpoint
ALTER TABLE "achievements_table" RENAME COLUMN "boosters" TO "boosters_number";--> statement-breakpoint
ALTER TABLE "game_sessions_table" RENAME COLUMN "start_at" TO "started_at";--> statement-breakpoint
ALTER TABLE "game_sessions_table" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "game_sessions_table" RENAME COLUMN "end_at" TO "ended_at";--> statement-breakpoint
ALTER TABLE "levels_table" RENAME COLUMN "score_require" TO "score_required";--> statement-breakpoint
ALTER TABLE "players_boosters_table" RENAME COLUMN "expire_at" TO "expired_at";--> statement-breakpoint
ALTER TABLE "players_boosters_table" RENAME COLUMN "create_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "players_table" RENAME COLUMN "using_character_id" TO "selected_character_id";--> statement-breakpoint
ALTER TABLE "vas_table" RENAME COLUMN "create_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "players_table" DROP CONSTRAINT "players_table_using_character_id_characters_table_id_fk";
--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "booster_unique" text;--> statement-breakpoint
ALTER TABLE "boosters_table" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_table" ADD CONSTRAINT "players_table_selected_character_id_characters_table_id_fk" FOREIGN KEY ("selected_character_id") REFERENCES "public"."characters_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
