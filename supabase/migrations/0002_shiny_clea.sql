CREATE TABLE IF NOT EXISTS "players_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"tel" text NOT NULL,
	"username" text,
	"gender" text,
	"birth_year" integer,
	"airflow" integer,
	"last_played_at" timestamp,
	CONSTRAINT "players_table_tel_unique" UNIQUE("tel")
);
