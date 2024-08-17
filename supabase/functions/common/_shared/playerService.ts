import { and, desc, eq, lt } from "npm:drizzle-orm@^0.31.4/expressions";
import { db } from "../db.ts";
import { charactersTable, gameSessionsTable, levelsTable, playersAchievementsTable, playersCharactersTable, playersTable } from "../schema.ts";
import { takeUniqueOrThrow } from "./takeUniqueOrThrow.ts";

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

export async function getLevel(playerId : number) {
    const allGameSessions = await db.select().from(gameSessionsTable).where(eq(gameSessionsTable.player_id,playerId))

    let totalScore = 0
    allGameSessions.forEach((gameSession) => {
        totalScore = totalScore + (gameSession.score === null ? 0 : gameSession.score)
    })

    const level = await db.select().from(levelsTable).where(lt(levelsTable.score_required,totalScore)).orderBy(desc(levelsTable.score_required))
    return level[0].level
}

export async function unlockCharacter(playerId : number, characterId : number){
    const achievementsList = await db.select().from(playersAchievementsTable).where(eq(playersAchievementsTable.player_id,playerId))
    const achievementsNumber = achievementsList.length

    const character = await db.select().from(charactersTable).where(eq(charactersTable.id,characterId)).then(takeUniqueOrThrow)

    if(achievementsNumber < character.achievement_number_required) {
        throw new Error("Achievements Number Required not met")
    }

    await db.insert(playersCharactersTable).values({
        player_id : playerId,
        character_id : characterId
    })
}

export async function getUnlockedCharacters(playerId : number) {
    const unlockedCharacters = await db.select().from(playersCharactersTable).where(eq(playersCharactersTable.player_id,playerId))

    return unlockedCharacters
}