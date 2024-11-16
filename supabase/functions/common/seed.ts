import {
  bossesTable,
  boostersTable,
  charactersTable,
  difficultiesTable,
  achievementsTable,
  levelsTable,
} from "./schema.ts";
import postgres from "npm:postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

const connectionString: string = env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("DB_URL is not defined in the .env file");
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

// run by $ deno run .\supabase\functions\common\seed.ts
const seed = async () => {
  // seeding Bosses Table
  console.log("Seeding Bosses...");
  try {
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
        name: "ก็อตซ่า",
      },
      {
        id: 4,
        name: "ไอซ์โกเลม",
      },
      {
        id: 5,
        name: "ไก่ทอด",
      },
    ]);
    console.log("Seed Bosses Done");
  } catch (error) {
    console.log("BossesTable: ", error);
  }

  // seeding boosters Table
  console.log("Seeding Boosters...");
  try {
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
    console.log("Seed Boosters Done");
  } catch (error) {
    console.log("BoostersTable: ", error);
  }

  // seeding Levels Table
  console.log("Seeding Levels");
  try {
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
    console.log("Seed Levels Done");
  } catch (error) {
    console.log("LevelsTable : ", error);
  }

  // seeding characters table
  console.log("Seeding Characters...");
  try {
    await db.insert(charactersTable).values([
      {
        id: 1,
        name: "นักผจญภัย",
        detail: "ลุยแบบสุดขีด เต็มพลัง",
        achievement_number_required: 0,
      },
      {
        id: 2,
        name: "นักเวทย์",
        detail: "เวทย์มนต์ไม่ใช่ของตั้งโชว์นะ",
        achievement_number_required: 4,
      },
      {
        id: 3,
        name: "จอมโจร",
        detail: "สมบัติของเธอ ขอรับไปละนะ",
        achievement_number_required: 8,
      },
      {
        id: 4,
        name: "มือปราบ",
        detail: "ด้วยอำนาจเจ้าหน้าที่ตำรวจสากล ขอใช้กำลังเช้าจับกุม",
        achievement_number_required: 12,
      },
    ]);
    console.log("Seed Characters Done");
  } catch (error) {
    console.log("CharactersTable: ", error);
  }

  // seeding difficulties table
  console.log("Seeding Difficulties...");
  try {
    await db.insert(difficultiesTable).values([
      {
        id: 1,
        name: "ง่าย",
        inhale_second: 0.5,
      },
      {
        id: 2,
        name: "ปานกลาง",
        inhale_second: 1,
      },
      {
        id: 3,
        name: "ยาก",
        inhale_second: 2,
      },
    ]);
    console.log("Seed Difficulties Done");
  } catch (error) {
    console.log("DifficultiesTable: ", error);
  }

  // seeding Achievements Table
  console.log("Seeding Achievements...");
  try {
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
    console.log("Seed Achievements Done");
  } catch (error) {
    console.log("AchievementsTable : ", error);
  }
};

console.log("Seed Start");
seed()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    console.log("Seed Done");
  });
