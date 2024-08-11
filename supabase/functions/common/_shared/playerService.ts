import { and, eq } from "npm:drizzle-orm@^0.31.4/expressions";
import { db } from "../db.ts";
import { playersCharactersTable, playersTable } from "../schema.ts";

export async function updateAirflow(playerId : number, airflow : number){
    if(airflow < 100 || airflow > 600 || airflow%100 !== 0) {
        throw new Error("Invalid Airflow Input")
    }

    await db.update(playersTable).set({airflow : airflow}).where(eq(playersTable.id,playerId))
}

export async function updateCurrentDifficulty(playerId : number, difficultyId : number) {
    await db.update(playersTable).set({difficulty_id : difficultyId}).where(eq(playersTable.id, playerId))
}

export async function updateUsername(playerId : number, username : string){
    if(username.length === 0 || username.length > 20) {
        throw new Error("Invalid Username Input")
    }

    await db.update(playersTable).set({username : username}).where(eq(playersTable.id, playerId))
}

export async function updateSelectedCharacter(playerId : number, characterId : number) {
    const characterCheck = await db.select().from(playersCharactersTable)
        .where(and(
            eq(playersCharactersTable.player_id,playerId),
            eq(playersCharactersTable.character_id,characterId)
        ))

    if(characterCheck.length < 1) {
        throw new Error("Character not unlocked")
    }

    await db.update(playersTable).set({selected_character_id : characterId}).where(eq(playersTable.id,playerId))
}