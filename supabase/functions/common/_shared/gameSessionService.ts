import { and, eq } from "npm:drizzle-orm@^0.31.4/expressions";
import { db } from "../db.ts";
import { gameSessionsTable } from "../schema.ts";
import { getCurrentDifficulty } from "./playerService.ts";

export async function startGame(playerId : number){
    // TODO random boss and booster

    await cancelGame(playerId) // cancel currently active game(s)
    const currentDifficultyId = await getCurrentDifficulty(playerId)

    await db.insert(gameSessionsTable).values({
        player_id : playerId,
        difficulty_id : currentDifficultyId,
        boss_id: 1,
        booster_drop_id: 1,
        score : 0,
        lap : 1,
        status: "ACTIVE"
    })
}

export async function cancelGame(playerId : number) {
    await db.update(gameSessionsTable).set({
        status : "CANCEL",
        ended_at : new Date()
    }).where(and(
        eq(gameSessionsTable.status,"ACTIVE"),
        eq(gameSessionsTable.player_id,playerId)
    ))
}

export async function updateGame(playerId : number, score : number, lap : number) {
    const updatedGame = await db.update(gameSessionsTable).set({
        lap : lap,
        score : score,
        updated_at: new Date()
    }).where(and(
        eq(gameSessionsTable.player_id,playerId),
        eq(gameSessionsTable.status,"ACTIVE")
    )).returning()

    if(updatedGame.length === 0) throw new Error("No Currently Active Game to Update")
}