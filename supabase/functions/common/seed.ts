import { 
     bossesTable,
     boostersTable, 
     charactersTable, 
     difficultiesTable,
     playersTable,
     gameSessionsTable
} from "./schema.ts"
import postgres from "npm:postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

const connectionString: string = env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("DB_URL is not defined in the .env file");
}

console.log(connectionString)

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

const seed = async () => {

     // deleting all table's value
     console.log("Prepare for seed... (delete all table's values)")
     // beware foreign key that can not delete so todo is order delete
     await db.delete(gameSessionsTable)
     await db.delete(playersTable)
     await db.delete(difficultiesTable)
     await db.delete(charactersTable)
     await db.delete(boostersTable)
     await db.delete(bossesTable)
     console.log("Prepare for seed done")

     // seeding bosses Table
     console.log("Seeding Bosses...")
     try {
          await db.insert(bossesTable).values([{
                    id: 1,
                    name: "เอเลี่ยนซ่า"
               },
               {
                    id: 2,
                    name: "สไลม์คิง"
               }
          ])
          console.log("Seed Bosses Done")
     } catch (error) {
          console.log("BossesTable: ", error);
     }
     
     // seeding boosters Table
     console.log("Seeding Boosters...")
     try {
          await db.insert(boostersTable).values([{
                    id: 1,
                    name: "booster1",
                    type: "NORMAL"
               },
               {
                    id: 2,
                    name: "booster2",
                    type: "NORMAL"
               },
               {
                    id: 3,
                    name: "booster3",
                    type: "NORMAL"
               },
               {
                    id: 4,
                    name: "booster4",
                    type: "NORMAL"
               },
               {
                    id: 5,
                    name: "booster5",
                    type: "NORMAL"
               },
               {
                    id: 6,
                    name: "booster_rare1",
                    type: "RARE"
               },
               {
                    id: 7,
                    name: "booster_rare2",
                    type: "RARE"
               }
          ])
          console.log("Seed Boosters Done")
     } catch (error) {
          console.log("BoostersTable: ", error);
     }

     // seeding characters table
     console.log("Seeding Characters...")
     try {
          await db.insert(charactersTable).values([
               {
                    id: 1,
                    name: "นักผจญภัย",
                    detail: "ลุยแบบสุดขีด เต็มพลัง",
                    achievement_number_required: 0
               },
               {
                    id: 2,
                    name: "นักเวทย์",
                    detail: "เวทย์มนต์ไม่ใช่ของตั้งโชว์นะ",
                    achievement_number_required: 4
               },
               {
                    id: 3,
                    name: "Thief",
                    detail: "สมบัติของเธอ ขอรับไปละนะ",
                    achievement_number_required: 8
               }
          ])
          console.log("Seed Characters Done")
     } catch (error) {
          console.log("CharactersTable: ", error);
     }

     // seeding difficulties table
     console.log("Seeding Difficulties...")
     try {
          await db.insert(difficultiesTable).values([
               {
                    id: 1,
                    name: "ง่าย",
                    inhale_second: 0.5
               },
               {
                    id: 2,
                    name: "ปานกลาง",
                    inhale_second: 1
               },
               {
                    id: 3,
                    name: "ยาก",
                    inhale_second: 2
               }
          ])
          console.log("Seed Difficulties Done")
     } catch (error) {
          console.log("DifficultiesTable: ", error);
     }

     // todo these seeds for test function
     // todo delete this code when seed for production 

     // seeding players Table
     console.log("Seeding Players...")
     try {
          await db.insert(playersTable).values([
               {
                    id: 1,
                    firebase_id : "abc",
                    phone_number: "0123456789",
                    difficulty_id: 1,
                    selected_character_id: 1
               },
               {
                    id: 2,
                    firebase_id : "123",
                    phone_number: "0213456789",
                    difficulty_id: 1,
                    selected_character_id: 1
               }
          ])
          console.log("Seed Players Done")
     } catch (error) {
          console.log("PlayersTable: ", error)
     }

     // seeding gameSessions table
     console.log("Seeding GameSession...")
     try {
          await db.insert(gameSessionsTable).values({
               id: 1,
               player_id: 1,
               difficulty_id: 2,
               boss_id: 1,
               booster_drop_id: 2,
               score: 68721,
               status: "ACTIVE",
               lap: 4
          })
          console.log("Seed GameSession Done")
     } catch (error) {
          console.log("GameSessionsTable: ", error)
     } 
}

console.log('Seed Start')
seed()
.catch((e) => {
     console.error(e)
})
.finally(() => {
     console.log('Seed Done')
})
