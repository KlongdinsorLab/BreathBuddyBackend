ALTER TABLE "characters_table" RENAME COLUMN "achievement_required_number" TO "achievement_number_required";--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "games_played_in_a_day" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "games_played_consecutive_days" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "accumulative_score" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "games_played" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "boosters" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "booster_type" text;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "booster_action" text;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "boss_id" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "boss_encounter" integer;--> statement-breakpoint
ALTER TABLE "achievements_table" ADD COLUMN "characters_unlocked" integer;--> statement-breakpoint
ALTER TABLE "game_sessions_table" ADD COLUMN "booster_drop_duration" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "achievements_table" ADD CONSTRAINT "achievements_table_boss_id_bosses_table_id_fk" FOREIGN KEY ("boss_id") REFERENCES "public"."bosses_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
