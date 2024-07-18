CREATE TABLE IF NOT EXISTS "achievements_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"detail" text,
	CONSTRAINT "achievements_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boosters_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"detail" text,
	CONSTRAINT "boosters_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bosses_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"detail" text,
	CONSTRAINT "bosses_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "characters_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"achievement_required_number" integer NOT NULL,
	"detail" text,
	CONSTRAINT "characters_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "difficulties_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"inhale_second" real NOT NULL,
	CONSTRAINT "difficulties_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_sessions_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"difficulty_id" integer NOT NULL,
	"boss_id" integer NOT NULL,
	"booster_drop_id" integer NOT NULL,
	"score" integer,
	"lap" integer,
	"start_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp,
	"end_at" timestamp,
	"status" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players_achievements_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"achievement_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players_boosters_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"booster_id" integer NOT NULL,
	"expire_at" timestamp,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"status" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players_characters_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"character_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text NOT NULL,
	"phone_number" text NOT NULL,
	"difficulty_id" integer DEFAULT 1 NOT NULL,
	"using_character_id" integer DEFAULT 1 NOT NULL,
	"username" text,
	"gender" text,
	"birth_year" integer,
	"airflow" integer,
	"last_played_at" timestamp,
	CONSTRAINT "players_table_firebase_id_unique" UNIQUE("firebase_id"),
	CONSTRAINT "players_table_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vas_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"vas_score" integer NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_sessions_table" ADD CONSTRAINT "game_sessions_table_player_id_players_table_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_sessions_table" ADD CONSTRAINT "game_sessions_table_difficulty_id_difficulties_table_id_fk" FOREIGN KEY ("difficulty_id") REFERENCES "public"."difficulties_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_sessions_table" ADD CONSTRAINT "game_sessions_table_boss_id_bosses_table_id_fk" FOREIGN KEY ("boss_id") REFERENCES "public"."bosses_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_sessions_table" ADD CONSTRAINT "game_sessions_table_booster_drop_id_boosters_table_id_fk" FOREIGN KEY ("booster_drop_id") REFERENCES "public"."boosters_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_achievements_table" ADD CONSTRAINT "players_achievements_table_player_id_players_table_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_achievements_table" ADD CONSTRAINT "players_achievements_table_achievement_id_achievements_table_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_boosters_table" ADD CONSTRAINT "players_boosters_table_player_id_players_table_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_boosters_table" ADD CONSTRAINT "players_boosters_table_booster_id_boosters_table_id_fk" FOREIGN KEY ("booster_id") REFERENCES "public"."boosters_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_characters_table" ADD CONSTRAINT "players_characters_table_player_id_players_table_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_characters_table" ADD CONSTRAINT "players_characters_table_character_id_characters_table_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_table" ADD CONSTRAINT "players_table_difficulty_id_difficulties_table_id_fk" FOREIGN KEY ("difficulty_id") REFERENCES "public"."difficulties_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "players_table" ADD CONSTRAINT "players_table_using_character_id_characters_table_id_fk" FOREIGN KEY ("using_character_id") REFERENCES "public"."characters_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vas_table" ADD CONSTRAINT "vas_table_player_id_players_table_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
