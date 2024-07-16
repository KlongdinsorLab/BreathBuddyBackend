ALTER TABLE "players_table" ALTER COLUMN "firebase_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "players_table" ALTER COLUMN "difficulty_id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "difficulties_table" ADD CONSTRAINT "difficulties_table_name_unique" UNIQUE("name");