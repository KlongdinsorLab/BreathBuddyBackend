import { and, eq, lt, desc } from "npm:drizzle-orm@^0.31.4/expressions";
import { db } from "../db.ts";
import { gameSessionsTable, levelsTable, playersTable } from "../schema.ts";
import { getCurrentDifficulty } from "./playerService.ts";
import { checkSameDay, getNewAchivements as getNewAchievements } from "./achievementsService.ts";
import { gameSessionInterface } from "./interfaces.ts";
import { getLevelByScore } from "./levelService.ts";
import { playersBoostersTable } from "../schema.ts";
import { takeUniqueOrThrow } from "./takeUniqueOrThrow.ts";

export async function startGame(playerId: number) {
  // TODO random boss and booster

  await cancelGame(playerId); // cancel currently active game(s)
  const currentDifficultyId = await getCurrentDifficulty(playerId);

  await db.insert(gameSessionsTable).values({
    player_id: playerId,
    difficulty_id: currentDifficultyId,
    boss_id: 1,
    booster_drop_id: 1,
    score: 0,
    lap: 1,
    status: "ACTIVE",
  });
}

export async function cancelGame(playerId: number) {
  await db
    .update(gameSessionsTable)
    .set({
      status: "CANCEL",
      ended_at: new Date(),
    })
    .where(
      and(
        eq(gameSessionsTable.status, "ACTIVE"),
        eq(gameSessionsTable.player_id, playerId)
      )
    );
}

export async function updateGame(playerId: number, score: number, lap: number) {
  const updatedGame = await db
    .update(gameSessionsTable)
    .set({
      lap: lap,
      score: score,
      updated_at: new Date(),
    })
    .where(
      and(
        eq(gameSessionsTable.player_id, playerId),
        eq(gameSessionsTable.status, "ACTIVE")
      )
    )
    .returning();

  if (updatedGame.length === 0)
    throw new Error("No Currently Active Game to Update");
}

export async function finishGame(
  playerId: number,
  score: number,
  playerTotalScore: number,
  lap: number,
  isBoosterReceived: boolean
) {
  if (lap !== 10) throw new Error("Incorrect Lap");

  let boosterDropId: number = 0;
  const now = new Date();
  await db.transaction(async (tx) => {
    const game = await tx
      .update(gameSessionsTable)
      .set({
        lap: lap,
        score: score,
        updated_at: now,
        ended_at: now,
        status: "END",
      })
      .where(
        and(
          eq(gameSessionsTable.player_id, playerId),
          eq(gameSessionsTable.status, "ACTIVE")
        )
      )
      .returning()
      .then(takeUniqueOrThrow);

    console.log(game);

    if (isBoosterReceived) {
      await tx.insert(playersBoostersTable).values({
        player_id: playerId,
        booster_id: game.booster_drop_id,
        status: "ACTIVE",
      });
    }
    boosterDropId = game.booster_drop_id;
  });

  const newAchievements = await getNewAchievements(playerId);
  const totalGames = getTotalGames(playerId);
  const gamesPlayedToday = getGamesPlayedToday(playerId);

  const level = await db
    .select()
    .from(levelsTable)
    .where(lt(levelsTable.score_required, playerTotalScore + score))
    .orderBy(desc(levelsTable.score_required));
  const newLevel = level[0];
  const oldLevel = await getLevelByScore(playerTotalScore);
  const isLevelUp: boolean = newLevel.level !== oldLevel.level;

  await db.transaction(async (tx) => {
    await tx
      .update(playersTable)
      .set({ total_score: playerTotalScore + score })
      .where(eq(playersTable.id, playerId))
      .returning()
      .then(takeUniqueOrThrow);
  })

  return {
    new_achievements: newAchievements,
    total_games: totalGames,
    games_played_today: gamesPlayedToday,
    level_up: isLevelUp,
    level: newLevel,
    booster: isBoosterReceived ? boosterDropId : null,
  };
}

export async function getTotalGames(playerId: number) {
  const allGames = await db
    .select()
    .from(gameSessionsTable)
    .where(eq(gameSessionsTable.player_id, playerId));
  return allGames.length;
}

export async function getGamesPlayedToday(playerId: number) {
  const allGames = await db
    .select()
    .from(gameSessionsTable)
    .where(eq(gameSessionsTable.player_id, playerId))
    .orderBy(gameSessionsTable.started_at);
  const now = new Date();
  const gamesPlayedToday: gameSessionInterface[] = [];

  allGames.forEach((gameSession) => {
    const isSameDay = checkSameDay(now, gameSession.started_at);

    if (isSameDay) {
      gamesPlayedToday.push(gameSession);
    } else return;
  });

  return gamesPlayedToday;
}
