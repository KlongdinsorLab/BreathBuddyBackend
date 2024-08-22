import { and, eq, isNotNull, notExists, or } from "npm:drizzle-orm@^0.31.2/expressions";
import { db } from "../db.ts";
import { achievementsTable, gameSessionsTable, playersAchievementsTable, playersCharactersTable, } from "../schema.ts";
import { playersBoostersTable } from "../schema.ts";
import { boostersTable } from "../schema.ts";

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

interface playersCharactersInterface {
    id: number,
    player_id: number,
    character_id: number
}

interface playersBoostersInterface {
    id: number,
    player_id: number,
    booster_id: number,
    expired_at: Date | null,
    created_at: Date,
    status: string
    type: string
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

export async function getNewAchivements(playerId : number) { // Call this
    const lockedAchievements = await getAllAchievements() // TODO change to getLockedAchievements 
    const gameSessionList = await db.select().from(gameSessionsTable).where(eq(gameSessionsTable.player_id, playerId)).orderBy(gameSessionsTable.started_at)
    const playersCharactersList = await db.select().from(playersCharactersTable).where(eq(playersCharactersTable.player_id,playerId))
    const playersBoostersList = await db.select({
            id : playersBoostersTable.id,
            player_id : playersBoostersTable.player_id,
            booster_id : playersBoostersTable.booster_id,
            expired_at : playersBoostersTable.expired_at,
            created_at : playersBoostersTable.created_at,
            status : playersBoostersTable.status,
            type : boostersTable.type
        }).from(playersBoostersTable)
        .where(eq(playersBoostersTable.player_id,playerId))
        .innerJoin(boostersTable,eq(boostersTable.id,playersBoostersTable.booster_id))


    // lockedAchievements.forEach(async (element) => {
    //     await checkAchievement(playerId, element, gameSessionList, playersCharactersList,playersBoostersList)
    // })

    for(let i = 0;i < lockedAchievements.length;i++) await checkAchievement(playerId, lockedAchievements[i],gameSessionList,playersCharactersList,playersBoostersList)

}

export async function checkAchievement(
    playerId : number, 
    achievement : achievementInterface, 
    gameSessionList : gameSessionInterface[],
    playersCharactersList : playersCharactersInterface[],
    playersBoostersList: playersBoostersInterface[]
) {
    let unlock : boolean = true

    if(achievement.accumulative_score !== null) {
        unlock = unlock && checkAchievementScore(playerId,achievement,gameSessionList)
    }

    if(achievement.games_played !== null) {
        unlock = unlock && checkAchievementTotalGames(playerId,achievement,gameSessionList)
    }

    if(achievement.boss_id !== null) {
        unlock = unlock && checkAchievementBossEncounters(playerId,achievement,gameSessionList)
    }

    if(achievement.characters_unlocked) {
        unlock = unlock && checkAchievementCharactersUnlocked(playerId, achievement, playersCharactersList)
    }

    if(achievement.boosters_number) {
        unlock = unlock && checkAchievementBoosters(playerId,achievement,playersBoostersList)
    }

    if(achievement.games_played_in_a_day) {
        unlock = unlock && checkAchievementGamesPlayedInADay(playerId,achievement,gameSessionList)
    }

    if(achievement.games_played_consecutive_days) {
        unlock = unlock && checkAchievementGamesPlayedConsecutiveDay(playerId,achievement,gameSessionList)
    }
    

    if(unlock) await unlockAchievement(playerId,achievement.id) 
}

export async function unlockAchievement (playerId: number, achievementId: number){
    await db.insert(playersAchievementsTable).values({
        player_id: playerId,
        achievement_id: achievementId
    })
}

export function checkAchievementScore(
    playerId : number, 
    achievement : achievementInterface,
    gameSessionList : {id: number, score: number | null}[]
) : boolean{
    if(playerId === null || achievement.id === null || achievement.accumulative_score === null) return false

    let totalScore = 0
    gameSessionList.forEach((element) => {
        totalScore += element.score ?? 0
    })

    console.log("Score Requied : " + achievement.accumulative_score + "\nPlayer Score : " + totalScore)

    if(totalScore >= achievement.accumulative_score!){ 
        console.log(true) 
        return true 
    }
    else {
        console.log(false)
        return false
    }
}

export function checkAchievementTotalGames(
    playerId : number,
    achievement : achievementInterface,
    gameSessionList : gameSessionInterface[]
) : boolean {
    if(playerId === null || achievement.id === null || achievement.games_played === null) return false

    const endedGameSessionList = gameSessionList.filter((element) => 
        element.status === "END")

    console.log("Game Required : " + achievement.games_played + "\nGame Finished : " + endedGameSessionList.length)

    if (endedGameSessionList.length >= achievement.games_played!) return true
    else return false
}

export function checkAchievementBossEncounters(
    playerId : number,
    achievement : achievementInterface,
    gameSessionList : gameSessionInterface[]
) : boolean {
    if(playerId === null || achievement.id === null || achievement.boss_id === null || achievement.boss_encounter === null) return false

    const bossGameSessionList = gameSessionList.filter((element) => element.boss_id === achievement.boss_id)

    console.log("Boss " + achievement.boss_id + " Required : " + achievement.boss_encounter + "\n Boss " + achievement.boss_id + " Encountered : " + bossGameSessionList.length)
    if(bossGameSessionList.length >= achievement.boss_encounter!) return true
    else return false
}

export function checkAchievementCharactersUnlocked(
    playerId : number,
    achievement : achievementInterface,
    playersChractersList : playersCharactersInterface[]
) : boolean {
    if(playerId === null || achievement.id === null || achievement.characters_unlocked === null) return false

    console.log("Character Required : " + achievement.characters_unlocked + "\nCharacter Unlocked : " + playersChractersList.length)

    if(playersChractersList.length >= achievement.characters_unlocked!) return true
    else return false
}

export function checkAchievementBoosters(
    playerId : number,
    achievement : achievementInterface,
    playersBoostersList : playersBoostersInterface[]
) : boolean {
    if(
        playerId === null || 
        achievement.boosters_number === null || 
        achievement.id === null || 
        achievement.booster_action === null
    ) return false

    let totalNumber : number = playersBoostersList.length
    if(achievement.booster_action === "USE") {
        playersBoostersList = playersBoostersList.filter((element) => element.status === "USED")
        totalNumber = playersBoostersList.length
    }

    if(achievement.booster_type !== null){
        playersBoostersList = playersBoostersList.filter((element) => element.type === achievement.booster_type)
        totalNumber = playersBoostersList.length
    } 
    
    if(achievement.booster_unique === "UNIQUE"){ 
        const uniqueBoosterList = [...new Set(playersBoostersList.map(item => item.booster_id))]
        totalNumber = uniqueBoosterList.length
        console.log(uniqueBoosterList)
    }

    if(totalNumber >= achievement.boosters_number!) return true
    else return false
}

export function checkAchievementGamesPlayedInADay(
    playerId : number,
    achievement : achievementInterface,
    gameSessionList :  gameSessionInterface[]
) : boolean{
    // TODO
    if(playerId === null || 
        achievement.games_played_in_a_day === null
    ) {
        return false
    }


    let max : number = 0
    let count : number = 1
    gameSessionList.forEach((_gameSession, index) => {
        if(index === 0) return

        const isSameDay = checkSameDay(gameSessionList[index - 1].started_at, gameSessionList[index].started_at)
        
        if(isSameDay) {
            count += 1
        }
        else {
            if(count > max) { max = count }
            count = 1
        }
    })

    if(count > max) { max = count }

    console.log("Games in a Day Required : " + achievement.games_played_in_a_day + "\nGames played in a day : " + max)
    console.log(max >= achievement.games_played_in_a_day!)

    return max >= achievement.games_played_in_a_day!

    // if(max >= achievement.games_played_in_a_day!) return true
    // else return false
}

export function checkAchievementGamesPlayedConsecutiveDay(
    playerId : number,
    achievement : achievementInterface,
    gameSessionList :  gameSessionInterface[]
){
    if(playerId === null || 
        achievement.games_played_consecutive_days === null
    ) {
        return false
    }

    let count : number = 1
    let max : number = 0
    gameSessionList.forEach((_gameSession, index) => {
        if(index === gameSessionList.length - 1) return

        if(checkOneDayApart(gameSessionList[index].started_at, gameSessionList[index + 1].started_at)) {
            count += 1
        }
        else if (checkSameDay(gameSessionList[index].started_at, gameSessionList[index + 1].started_at)) {
            return
        }
        else {
            if(count > max) { max = count }
            count = 1
        }

    })

    if(count > max) { max = count }

    console.log("Consecutive Days Required : " + achievement.games_played_consecutive_days + "\nPlayer's Consecutive Days : " + max)
    console.log(max >= achievement.games_played_consecutive_days!)

    return max >= achievement.games_played_consecutive_days!
    // TODO
}

export function checkOneDayApart(date1 : Date, date2 : Date) : boolean {
    const date1Tomorrow = new Date(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate() + 1)
    return date1Tomorrow.getUTCFullYear() === date2.getUTCFullYear() 
        && date1Tomorrow.getUTCMonth() === date2.getUTCMonth()
        && date1Tomorrow.getUTCDate() === date2.getUTCDate()
}

export function checkSameDay(date1 : Date, date2 : Date) : boolean {
    return date1.getUTCFullYear() === date2.getUTCFullYear() 
        && date1.getUTCMonth() === date2.getUTCMonth()
        && date1.getUTCDate() === date2.getUTCDate()
}