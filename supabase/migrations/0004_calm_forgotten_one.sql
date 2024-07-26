DROP TABLE "test_table";--> statement-breakpoint
DROP TABLE "users_table";--> statement-breakpoint
ALTER TABLE "characters_table" RENAME COLUMN "achievement_required_number" TO "achievement_number_required";--> statement-breakpoint
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
ALTER TABLE "achievements_table" ADD COLUMN "games_played_in_a_day" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "games_played_consecutive_days" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "accumulative_score" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "games_played" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "boosters_number" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "booster_type" text;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "booster_action" text;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "booster_unique" text;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "boss_id" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "boss_encounter" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "characters_unlocked" integer;--> statement-breakpoint
ALTER TABLE "boosters_table" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "game_sessions_table" ADD COLUMN "booster_drop_duration" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "achievements_table" ADD CONSTRAINT "achievements_table_boss_id_bosses_table_id_fk" FOREIGN KEY ("boss_id") REFERENCES "public"."bosses_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_table" ADD CONSTRAINT "players_table_selected_character_id_characters_table_id_fk" FOREIGN KEY ("selected_character_id") REFERENCES "public"."characters_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
