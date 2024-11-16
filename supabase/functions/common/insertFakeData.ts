import { playersTable, gameSessionsTable } from "./schema.ts";
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

// run by $ deno run .\supabase\functions\common\insertFakeData.ts
const insertFakeData = async () => {
  // seeding players Table
  console.log("Inserting Players...");
  try {
    await db.insert(playersTable).values([
      {
        id: 1,
        firebase_id: "abc",
        phone_number: "0123456789",
        difficulty_id: 1,
        selected_character_id: 1,
      },
      {
        id: 2,
        firebase_id: "123",
        phone_number: "0213456789",
        difficulty_id: 1,
        selected_character_id: 1,
      },
    ]);
    console.log("Insert Players Done");
  } catch (error) {
    console.log("PlayersTable: ", error);
  }

  // seeding gameSessions table
  console.log("Inserting GameSession...");
  try {
    await db.insert(gameSessionsTable).values({
      id: 1,
      player_id: 1,
      difficulty_id: 2,
      boss_id: 1,
      booster_drop_id: 2,
      score: 68721,
      status: "ACTIVE",
      lap: 4,
    });
    console.log("Insert GameSession Done");
  } catch (error) {
    console.log("GameSessionsTable: ", error);
  }
};

console.log("Insert Fake Data Start");
insertFakeData()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    console.log("Insert Fake Data Done");
  });
