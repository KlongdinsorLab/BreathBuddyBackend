// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  achievementsTable,
  boostersTable,
  bossesTable,
  charactersTable,
  difficultiesTable,
  levelsTable,
} from "../common/schema.ts";
import { db } from "../common/db.ts";
import { corsHeaders } from "../common/_shared/cors.ts";
import { logger } from "../common/logger.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    await addCharacters();
  } catch (e) {
    logger.error(e.message);
  }

  try {
    await addDifficulties();
  } catch (e) {
    logger.error(e.message);
  }

  try {
    await addBosses();
  } catch (e) {
    logger.error(e.message);
  }

  try {
    await addBoosters();
  } catch (e) {
    logger.error(e.message);
  }

  try {
    await addAchievements();
  } catch (e) {
    logger.error(e.message);
  }

  try {
    await addLevels();
  } catch (e) {
    logger.error(e.message);
  }

  const data = {
    characters: await db.select().from(charactersTable),
    difficulties: await db.select().from(difficultiesTable),
    bosses: await db.select().from(bossesTable),
    boosters: await db.select().from(boostersTable),
    achievements: await db.select().from(achievementsTable),
  };

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

async function addCharacters() {
  await db.insert(charactersTable).values({
    id: 1,
    name: "นักผจญภัย",
    detail: "ลุยแบบสุดขีด เต็มพลัง",
    achievement_number_required: 0,
  });
  await db.insert(charactersTable).values({
    id: 2,
    name: "นักเวทย์",
    detail: "เวทย์มนต์ไม่ใช่ของตั้งโชว์นะ",
    achievement_number_required: 4,
  });
  await db.insert(charactersTable).values({
    id: 3,
    name: "จอมโจร",
    detail: "สมบัติของเธอ ขอรับไปละนะ",
    achievement_number_required: 8,
  });
  await db.insert(charactersTable).values({
    id: 4,
    name: "มือปราบ",
    detail: "ด้วยอำนาจเจ้าหน้าที่ตำรวจสากล ขอใช้กำลังเช้าจับกุม",
    achievement_number_required: 12,
  });
}

async function addDifficulties() {
  await db.insert(difficultiesTable).values({
    id: 1,
    name: "ง่าย",
    inhale_second: 0.5,
  });
  await db.insert(difficultiesTable).values({
    id: 2,
    name: "ปานกลาง",
    inhale_second: 1,
  });
  await db.insert(difficultiesTable).values({
    id: 3,
    name: "ยาก",
    inhale_second: 2,
  });
}

async function addBosses() {
  await db.insert(bossesTable).values([
    {
      id: 1,
      name: "เอเลี่ยนซ่า",
    },
    {
      id: 2,
      name: "สไลม์คิง",
    },
    {
      id: 3,
      name: "แมว",
    },
    {
      id: 4,
      name: "คางคก",
    },
    {
      id: 5,
      name: "ไก่ทอด",
    },
  ]);
}

async function addBoosters() {
  await db.insert(boostersTable).values([
    {
      id: 1,
      name: "booster1",
      type: "NORMAL",
    },
    {
      id: 2,
      name: "booster2",
      type: "NORMAL",
    },
    {
      id: 3,
      name: "booster3",
      type: "NORMAL",
    },
    {
      id: 4,
      name: "booster4",
      type: "NORMAL",
    },
    {
      id: 5,
      name: "booster5",
      type: "NORMAL",
    },
    {
      id: 6,
      name: "booster_rare1",
      type: "RARE",
    },
    {
      id: 7,
      name: "booster_rare2",
      type: "RARE",
    },
  ]);
}

async function addAchievements() {
  await db.insert(achievementsTable).values([
    {
      id: 1,
      name: "3hearts",
      games_played_in_a_day: 3,
    },
    {
      id: 2,
      name: "3days",
      games_played_consecutive_days: 3,
    },
    {
      id: 3,
      name: "5days",
      games_played_consecutive_days: 5,
    },
    {
      id: 4,
      name: "7days",
      games_played_consecutive_days: 7,
    },
    {
      id: 5,
      name: "500k",
      accumulative_score: 5e5,
    },
    {
      id: 6,
      name: "3M",
      accumulative_score: 3e6,
    },
    {
      id: 7,
      name: "8M",
      accumulative_score: 8e6,
    },
    {
      id: 8,
      name: "20M",
      accumulative_score: 20e6,
    },
    {
      id: 9,
      name: "10 games",
      games_played: 10,
    },
    {
      id: 10,
      name: "100 games",
      games_played: 100,
    },
    {
      id: 11,
      name: "200 games",
      games_played: 200,
    },
    {
      id: 12,
      name: "10 boosters",
      boosters_number: 10,
      booster_action: "USE",
      booster_type: "NORMAL",
      booster_unique: "NONUNIQUE",
    },
    {
      id: 13,
      name: "5boosterrares",
      boosters_number: 5,
      booster_action: "USE",
      booster_type: "RARE",
      booster_unique: "NONUNIQUE",
    },
    {
      id: 14,
      name: "7boosters",
      boosters_number: 7,
      booster_action: "GAIN",
      booster_unique: "UNIQUE",
    },
    {
      id: 15,
      name: "20gamesb4",
      boss_encounter: 20,
      boss_id: 4,
    },
    {
      id: 16,
      name: "30gamesb5",
      boss_encounter: 30,
      boss_id: 5,
    },
    {
      id: 17,
      name: "4mc",
      characters_unlocked: 4,
    },
  ]);
}

async function addLevels() {
  await db.insert(levelsTable).values([
    {
      id: 1,
      level: 1,
      score_required: 0,
    },
    {
      id: 2,
      level: 2,
      score_required: 85000,
      boss_id: 2,
    },
    {
      id: 3,
      level: 3,
      score_required: 850000,
      booster_id_1: 4,
      booster_id_2: 5,
      booster_id_3: 6,
      booster_amount_1: 5,
      booster_amount_2: 5,
      booster_amount_3: 5,
    },
    {
      id: 4,
      level: 4,
      score_required: 2125000,
      boss_id: 3,
    },
    {
      id: 5,
      level: 5,
      score_required: 3825000,
      booster_id_1: 4,
      booster_id_2: 5,
      booster_id_3: 7,
      booster_amount_1: 5,
      booster_amount_2: 5,
      booster_amount_3: 5,
    },
    {
      id: 6,
      level: 6,
      score_required: 5190000,
      boss_id: 4,
    },
    {
      id: 7,
      level: 7,
      score_required: 10200000,
      booster_id_1: 4,
      booster_id_2: 5,
      booster_id_3: 6,
      booster_amount_1: 5,
      booster_amount_2: 5,
      booster_amount_3: 5,
    },
    {
      id: 8,
      level: 8,
      score_required: 15300000,
    },
    {
      id: 9,
      level: 9,
      score_required: 21250000,
      booster_id_1: 4,
      booster_id_2: 5,
      booster_id_3: 7,
      booster_amount_1: 5,
      booster_amount_2: 5,
      booster_amount_3: 5,
    },
    {
      id: 10,
      level: 10,
      score_required: 28050000,
    },
  ]);
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fake-seed' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
