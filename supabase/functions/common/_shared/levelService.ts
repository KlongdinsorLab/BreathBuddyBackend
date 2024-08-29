import { eq, desc, lte } from "npm:drizzle-orm@^0.31.4";
import { db } from "../db.ts";
import { gameSessionsTable, levelsTable } from "../schema.ts";

export async function getLevelByPlayer(playerId : number) {
    const allGameSessions = await db.select().from(gameSessionsTable).where(eq(gameSessionsTable.player_id,playerId))

    let totalScore = 0
    allGameSessions.forEach((gameSession) => {
        totalScore = totalScore + (gameSession.score === null ? 0 : gameSession.score)
    })

    const level = await db.select().from(levelsTable).where(lte(levelsTable.score_required,totalScore)).orderBy(desc(levelsTable.score_required))
    return level[0]
}

export async function getLevelByScore(score : number) {
    
    const level = await db.select().from(levelsTable).where(lte(levelsTable.score_required,score)).orderBy(desc(levelsTable.score_required))
    console.log("Level Service : " + level[0])
    return level[0]
}