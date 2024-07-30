DO $$ BEGIN
 CREATE TYPE "public"."booster_action" AS ENUM('USE', 'GAIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."booster_type" AS ENUM('NORMAL', 'RARE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."booster_unique" AS ENUM('UNIQUE', 'NONUNIQUE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."game_session_status" AS ENUM('ACTIVE', 'CANCEL', 'END');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('M', 'F');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."player_booster_status" AS ENUM('ACTIVE', 'USED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "achievements_table" ALTER COLUMN "booster_type" SET DATA TYPE booster_type USING booster_type::booster_type;--> statement-breakpoint
ALTER TABLE "achievements_table" ALTER COLUMN "booster_action" SET DATA TYPE booster_action USING booster_action::booster_action;--> statement-breakpoint
ALTER TABLE "achievements_table" ALTER COLUMN "booster_unique" SET DATA TYPE booster_unique USING booster_unique::booster_unique;--> statement-breakpoint
ALTER TABLE "boosters_table" ALTER COLUMN "type" SET DATA TYPE booster_type USING type::booster_type;--> statement-breakpoint
ALTER TABLE "game_sessions_table" ALTER COLUMN "status" SET DATA TYPE game_session_status USING status::game_session_status;--> statement-breakpoint
ALTER TABLE "players_boosters_table" ALTER COLUMN "status" SET DATA TYPE player_booster_status USING status::player_booster_status;--> statement-breakpoint
ALTER TABLE "players_boosters_table" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "players_table" ALTER COLUMN "gender" SET DATA TYPE gender USING gender::gender;