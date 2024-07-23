ALTER TABLE "players_table" ADD COLUMN "difficulty_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "players_table" ADD COLUMN "using_character_id" integer NOT NULL;--> statement-breakpoint
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
