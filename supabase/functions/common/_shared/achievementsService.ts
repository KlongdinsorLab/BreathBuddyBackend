import { and, eq, isNotNull, ne, or } from "npm:drizzle-orm@^0.31.2/expressions";
import { db } from "../db.ts";
import { achievementsTable, playersAchievementsTable, playersTable } from "../schema.ts";

export async function getLockedAchievementsSelectCharacter/* or MyBag? */(playerId: number) {
    const achievements = await db.select().from(achievementsTable)
        .innerJoin( playersAchievementsTable, ne(achievementsTable.id, playersAchievementsTable.achievement_id) )
        .innerJoin( playersTable, eq(playersTable.id, playersAchievementsTable.player_id) )
        .where(and(
            eq(playersTable.id,playerId),
            isNotNull(achievementsTable.characters_unlocked)
        ))

    return achievements
}

export async function getLockedAchievementsScoreUpdate (playerId: number) {
    const achievements = await db.select().from(achievementsTable)
        .innerJoin( playersAchievementsTable, ne(achievementsTable.id, playersAchievementsTable.achievement_id) )
        .innerJoin( playersTable, eq(playersTable.id, playersAchievementsTable.player_id) )
        .where(and(
            eq(playersTable.id,playerId),
            isNotNull(achievementsTable.accumulative_score)
        ))

    return achievements
}

export async function getLockedAchivementsEndGame (playerId: number) {
    const achievements = await db.select().from(achievementsTable)
        .innerJoin( playersAchievementsTable, ne(achievementsTable.id, playersAchievementsTable.achievement_id) )
        .innerJoin( playersTable, eq(playersTable.id, playersAchievementsTable.player_id) )
        .where(and(
            eq(playersTable.id,playerId),
            or(
                isNotNull(achievementsTable.games_played_in_a_day),
                isNotNull(achievementsTable.games_played),
                isNotNull(achievementsTable.games_played_consecutive_days)
            ) 
        ))

    return achievements
}

export async function getLockedAchievementsBooster (playerId: number) {
    const achievements = await db.select().from(achievementsTable)
        .innerJoin( playersAchievementsTable, ne(achievementsTable.id, playersAchievementsTable.achievement_id) )
        .innerJoin( playersTable, eq(playersTable.id, playersAchievementsTable.player_id) )
        .where(and(
            eq(playersTable.id,playerId),
            isNotNull(achievementsTable.boosters),
            eq(achievementsTable.booster_action, 'gain')
        ))

    return achievements
}

export async function getLockedAchievementsStartGame (playerId: number) {
    const achievements = await db.select().from(achievementsTable)
        .innerJoin( playersAchievementsTable, ne(achievementsTable.id, playersAchievementsTable.achievement_id) )
        .innerJoin( playersTable, eq(playersTable.id, playersAchievementsTable.player_id) )
        .where(and(
            eq(playersTable.id,playerId),
            or(
                isNotNull(achievementsTable.boss_encounter),
                and(
                    isNotNull(achievementsTable.boosters),
                    eq(achievementsTable.booster_action,"use")
                )
            )
        ))

    return achievements
}