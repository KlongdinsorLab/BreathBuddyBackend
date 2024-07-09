CREATE TABLE IF NOT EXISTS "levels_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" integer NOT NULL,
	"score_require" integer NOT NULL,
	CONSTRAINT "levels_table_level_unique" UNIQUE("level")
);
