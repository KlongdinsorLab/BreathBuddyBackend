import { and, eq, isNotNull, notExists, or } from "npm:drizzle-orm@^0.31.2/expressions";
import { db } from "../db.ts";
import { achievementsTable, playersAchievementsTable, } from "../schema.ts";

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

export async function getLockedAchievementsBooster (playerId: number) {
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
        isNotNull(achievementsTable.boosters),
        eq(achievementsTable.booster_action, 'gain')
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
            isNotNull(achievementsTable.boosters),
            eq(achievementsTable.booster_action,"use")
        )
    ))

    return achievements
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

export async function getAllAchievements () {
    const achievements = await db.select().from(achievementsTable)

    return achievements
}