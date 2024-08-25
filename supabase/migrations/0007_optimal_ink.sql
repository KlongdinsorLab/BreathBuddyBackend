ALTER TABLE "players_table" ALTER COLUMN "total_score" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "players_table" ALTER COLUMN "total_score" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "levels_table" ADD COLUMN "boss_id" integer;--> statement-breakpoint
ALTER TABLE "levels_table" ADD COLUMN "booster_id_1" integer;--> statement-breakpoint
ALTER TABLE "levels_table" ADD COLUMN "booster_id_2" integer;--> statement-breakpoint
ALTER TABLE "levels_table" ADD COLUMN "booster_id_3" integer;--> statement-breakpoint
ALTER TABLE "levels_table" ADD COLUMN "booster_amount_1" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "levels_table" ADD COLUMN "booster_amount_2" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "levels_table" ADD COLUMN "booster_amount_3" integer DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "levels_table" ADD CONSTRAINT "levels_table_boss_id_bosses_table_id_fk" FOREIGN KEY ("boss_id") REFERENCES "public"."bosses_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "levels_table" ADD CONSTRAINT "levels_table_booster_id_1_boosters_table_id_fk" FOREIGN KEY ("booster_id_1") REFERENCES "public"."boosters_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "levels_table" ADD CONSTRAINT "levels_table_booster_id_2_boosters_table_id_fk" FOREIGN KEY ("booster_id_2") REFERENCES "public"."boosters_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "levels_table" ADD CONSTRAINT "levels_table_booster_id_3_boosters_table_id_fk" FOREIGN KEY ("booster_id_3") REFERENCES "public"."boosters_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
