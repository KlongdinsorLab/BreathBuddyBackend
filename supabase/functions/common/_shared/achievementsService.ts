import { and, eq, isNotNull, notExists, or } from "npm:drizzle-orm@^0.31.2/expressions";
import { db } from "../db.ts";
import { achievementsTable, gameSessionStatusEnum, gameSessionsTable, playersAchievementsTable, } from "../schema.ts";
import { playersBoostersTable } from "../schema.ts";

interface achievementInterface {
    id: number
    games_played_in_a_day?: number | null,
    games_played_consecutive_days?: number | null,
    accumulative_score?: number | null,
    games_played?: number | null,
    boosters_number?: number | null,
    booster_type?: string | null,
    booster_action?: string | null,
    booster_unique?: string | null,
    boss_id?: number | null,
    boss_encounter?: number | null,
    characters_unlocked?: number | null
}

interface gameSessionInterface {
    id: number,
    player_id: number,
    difficulty_id: number,
    boss_id: number,
    booster_drop_id: number,
    booster_drop_duration: number | null,
    score: number | null,
    lap: number | null,
    started_at: Date,
    updated_at: Date | null,
    ended_at: Date | null,
    status: string | null
}

export async function getLockedAchievementsSelectCharacter/* or MyBag? */(playerId: number) {
    const achievements = await db.select({
        id: achievementsTable.id,
        name: achievementsTable.name,
        detail: achievementsTable.detail
    }).from(achievementsTable)
        // .innerJoin( playersTable, eq(playersTable.id, playerId) )
        // .leftJoin( playersAchievementsTable, eq(playersTable.id, playersAchievementsTable.player_id) )
        // .where(and(
        //     isNotNull(achievementsTable.characters_unlocked),
        // ))

        .where(and(
            notExists(db.select().from(playersAchievementsTable).where(and(
                eq(playersAchievementsTable.achievement_id, achievementsTable.id),
                eq(playersAchievementsTable.player_id, playerId )
            ))),
            isNotNull(achievementsTable.characters_unlocked)
        ))

    return achievements
}

export async function getLockedAchievementsScoreUpdate (playerId: number) {
    const achievements = await db.select({
        id: achievementsTable.id,
        name: achievementsTable.name,
        detail: achievementsTable.detail
    }).from(achievementsTable)
        .where(and(
            notExists(db.select().from(playersAchievementsTable).where(and(
                eq(playersAchievementsTable.achievement_id, achievementsTable.id),
                eq(playersAchievementsTable.player_id, playerId )
            ))),
            isNotNull(achievementsTable.accumulative_score)
        ))

    return achievements
}

export async function getLockedAchivementsEndGame (playerId: number) {
    const achievements = await db.select({
        id: achievementsTable.id,
        name: achievementsTable.name,
        detail: achievementsTable.detail
    }).from(achievementsTable)
    .where(and(
        notExists(db.select().from(playersAchievementsTable).where(and(
            eq(playersAchievementsTable.achievement_id, achievementsTable.id),
            eq(playersAchievementsTable.player_id, playerId )
        ))),
        or(
            isNotNull(achievementsTable.games_played_in_a_day),
            isNotNull(achievementsTable.games_played),
            isNotNull(achievementsTable.games_played_consecutive_days)
        )
            
    ))

    return achievements
}

export async function getLockedAchievementsGainBooster (playerId: number) {
    const achievements = await db.select({
        id: achievementsTable.id,
        name: achievementsTable.name,
        detail: achievementsTable.detail
    }).from(achievementsTable)
    .where(and(
        notExists(db.select().from(playersAchievementsTable).where(and(
            eq(playersAchievementsTable.achievement_id, achievementsTable.id),
            eq(playersAchievementsTable.player_id, playerId )
        ))),
        isNotNull(achievementsTable.boosters_number),
        eq(achievementsTable.booster_action, 'GAIN')
    ))

    return achievements
}

export async function getLockedAchievementsStartGame (playerId: number) {
    const achievements = await db.select({
        id: achievementsTable.id,
        name: achievementsTable.name,
        detail: achievementsTable.detail
    }).from(achievementsTable)
    .where(and(
        notExists(db.select().from(playersAchievementsTable).where(and(
            eq(playersAchievementsTable.achievement_id, achievementsTable.id),
            eq(playersAchievementsTable.player_id, playerId )
        ))),
        isNotNull(achievementsTable.boss_encounter),
        and(
            isNotNull(achievementsTable.boosters_number),
            eq(achievementsTable.booster_action,"USE")
        )
    ))

    return achievements
}

export async function getLockedAchievements (playerId: number) {
    const achievement = await db.select()
        .from(achievementsTable)
        .where(
            notExists(db.select().from(playersAchievementsTable).where(and(
                eq(playersAchievementsTable.achievement_id, achievementsTable.id),
                eq(playersAchievementsTable.player_id,playerId)
            )))
        )

    return achievement
}

export async function getUnlockedAchievements (playerId: number) { // for My Bag page
    const achievements = await db.select({
        id: achievementsTable.id,
        name: achievementsTable.name,
        detail: achievementsTable.detail
    }).from(achievementsTable)
    .innerJoin(playersAchievementsTable, eq(playersAchievementsTable.achievement_id, achievementsTable.id))
    .where(eq(playersAchievementsTable.player_id, playerId))

    return achievements
}

export async function getAllAchievements() {
    const achievements = await db.select().from(achievementsTable)

    return achievements
}

export async function getNewAchivements(playerId : number) {
    const lockedAchievements = await getLockedAchievements(playerId)
    const gameSessionList = await db.select().from(gameSessionsTable).where(eq(gameSessionsTable.player_id, playerId))

    lockedAchievements.forEach((element) => {
        checkAchievement(playerId, element, gameSessionList)
    })


}

export async function checkAchievement(playerId : number, achievement : achievementInterface, gameSessionList : gameSessionInterface[]) {
    if(achievement.accumulative_score !== null) {
        if(checkAchievementScore({id: playerId},achievement,gameSessionList)) await unlockAchievement(playerId,achievement.id)
    }
    // if(achievement.games_played) {
    //     console.log(achievement.games_played)
    //     console.log(checkAchievementTotalGames({id: playerId},achievement,gameSessionList))
    // }
    // if(achievement.boss_id) {
    //     console.log("Achievement Id : " + achievement.id)
    //     console.log(checkAchievementBossEncounters({id: playerId},achievement,gameSessionList))
    // }
    // if(achievement.characters_unlocked) {
    //     console.log("Achievement Id : " + achievement.id)
    //     console.log(checkAchievementCharactersUnlocked({id: playerId},achievement,gameSessionList))
    // }
}

export async function unlockAchievement (playerId: number, achievementId: number){
    await db.insert(playersAchievementsTable).values({
        player_id: playerId,
        achievement_id: achievementId
    })
}

export function checkAchievementScore(
    player : {id: number}, 
    achievement : achievementInterface,
    gameSessionList : {id: number, score: number | null}[]
) : boolean{
    if(player.id === null || !achievement.id === null || achievement.accumulative_score === null) {
        return false
    }

    let totalScore = 0
    gameSessionList.forEach((element) => {
        totalScore += element.score ?? 0
    })

    console.log("Score Requied : " + achievement.accumulative_score + "\nPlayer Score : " + totalScore)

    if(totalScore >= achievement.accumulative_score!) return true 
    else return false
}

export function checkAchievementTotalGames(
    player : {id: number},
    achievement : achievementInterface,
    gameSessionList : gameSessionInterface[]
) : boolean {
    if(!player.id || achievement.id || achievement.games_played) return false

    const endedGameSessionList = gameSessionList.filter((element) => {element.status === "END"})
    if (endedGameSessionList.length >= achievement.games_played!) return true
    else return false
}

export function checkAchievementBossEncounters(
    player : {id : number},
    achievement : achievementInterface,
    gameSessionList : gameSessionInterface[]
) : boolean {
    if(!player.id || achievement.id || achievement.boss_id || achievement.boss_encounter) return false

    const bossGameSessionList = gameSessionList.filter((element) => {element.boss_id === achievement.boss_id})
    if(bossGameSessionList.length >= achievement.boss_encounter!) return true
    else return false
}

export function checkAchievementCharactersUnlocked(
    player : {id: number},
    achievement : achievementInterface,
    playersChractersList : gameSessionInterface[]
) : boolean {
    if(!player.id || achievement.id || achievement.characters_unlocked) return false

    if(playersChractersList.length >= achievement.characters_unlocked!) return true
    else return false
}

export function checkAchievementBoosters(
    player : {id: number},
    achievement : {id: number, booster_number: number},
    playersBoostersList : {id: number, player_id: number, booster_id: number, status: string}[]
) : boolean {
    if(!player.id || achievement.booster_number || achievement.id) return false

    if(playersBoostersList.length >= achievement.booster_number) return true
    else return false
}