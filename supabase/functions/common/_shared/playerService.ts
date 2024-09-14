import { and, desc, eq, lt } from "npm:drizzle-orm@^0.31.4/expressions";
import { db } from "../db.ts";
import { charactersTable, difficultiesTable, playersAchievementsTable, playersCharactersTable, playersTable } from "../schema.ts";
import { takeUniqueOrThrow } from "./takeUniqueOrThrow.ts";
import { getLevelByScore } from "./levelService.ts"
import { getGamesPlayedToday, getLastTwoGames, getTotalGames } from "./gameSessionService.ts";

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

export async function getCurrentDifficulty(playerId : number) {
    const {difficultyId} = await db.select({difficultyId : playersTable.difficulty_id}).from(playersTable).where(eq(playersTable.id,playerId)).then(takeUniqueOrThrow)

    return difficultyId
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

export async function getRanking() {
    const ranking = await db.select({
        username : playersTable.username,
        total_score : playersTable.total_score
    }).from(playersTable).orderBy(desc(playersTable.total_score))

    return ranking
}

export async function getPlayer(playerId : number){
    const player = await db.select().from(playersTable).where(eq(playersTable.id,playerId)).then(takeUniqueOrThrow)
    const playerLevel = await getLevelByScore(player.total_score)
    const playCount = await getTotalGames(playerId)
    const playToday = await getGamesPlayedToday(playerId)
    const difficulty = await db.select().from(difficultiesTable).where(eq(difficultiesTable.id,player.difficulty_id)).then(takeUniqueOrThrow)
    const unlockedCharacters = await getUnlockedCharacters(playerId)
    const unlockedCharactersId = unlockedCharacters.map(obj => obj.id)

    return {
        username : player.username,
        level : playerLevel,
        airflow : player.airflow,
        play_count : playCount,
        play_today : playToday,
        difficulty : difficulty,
        selected_character_id : player.selected_character_id,
        unlocked_characters_id : unlockedCharactersId
    }
}
