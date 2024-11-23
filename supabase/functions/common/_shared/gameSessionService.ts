// import { and, eq, lte, desc, isNotNull } from "npm:drizzle-orm@^0.31.4/expressions";
import { db } from "../db.ts";
import {
  boostersTable,
  gameSessionsTable,
  levelsTable,
  playersTable,
} from "../schema.ts";
import { getCurrentDifficulty } from "./playerService.ts";
import {
  checkSameDay,
  getNewAchivements as getNewAchievements,
} from "./achievementsService.ts";
import { gameSessionInterface } from "./interfaces.ts";
import { getLevelByScore } from "./levelService.ts";
import { playersBoostersTable } from "../schema.ts";
import { takeUniqueOrThrow } from "./takeUniqueOrThrow.ts";
import { addHours, checkToday } from "./dateService.ts";
import { and, desc, eq, gt, isNotNull, isNull, lte, or } from "drizzle-orm";
import { playerBoosterStatusEnum } from "../schema.ts";
import { logger } from "../logger.ts";

type BoosterStatus = "ACTIVE" | "USED";

export async function startGame(playerId: number, boosterId?: number) {
  await cancelGame(playerId); // cancel currently active game(s)
  const currentDifficultyId = await getCurrentDifficulty(playerId);
  const boosterDrop = await getRandomBooster();
  const bossId = await getRandomBoss(playerId);

  await db.transaction(async (tx) => {
    if (boosterId) {
      const now = new Date();

      const availableBoosters = await tx
        .select()
        .from(playersBoostersTable)
        .where(
          and(
            eq(playersBoostersTable.player_id, playerId),
            eq(playersBoostersTable.status, "ACTIVE"),
            eq(playersBoostersTable.booster_id, boosterId),
            or(
              isNull(playersBoostersTable.expired_at),
              gt(playersBoostersTable.expired_at, now),
            ),
          ),
        )
        .orderBy(playersBoostersTable.expired_at);

      logger.debug(`Available achievements: ${availableBoosters}`);

      if (availableBoosters.length === 0) throw new Error("No booster to use");

      await tx
        .update(playersBoostersTable)
        .set({ status: "USED" })
        .where(eq(playersBoostersTable.id, availableBoosters[0].id));
    }

    const gameSession = await tx.insert(gameSessionsTable).values({
      player_id: playerId,
      difficulty_id: currentDifficultyId,
      boss_id: bossId,
      booster_drop_id: boosterDrop.id,
      booster_drop_duration: boosterDrop.duration === 0
        ? null
        : boosterDrop.duration,
      score: 0,
      lap: 1,
      status: "ACTIVE",
    })
      .returning()
      .then(takeUniqueOrThrow);

    logger.info(
      `Game session ${gameSession.id} start successfully`,
    );
  });
  return {
    booster_drop_id: boosterDrop.id,
    booster_drop_duration: boosterDrop.duration,
    boss_id: bossId,
  };
}

export async function cancelGame(playerId: number) {
  const gameSession = await db
    .update(gameSessionsTable)
    .set({
      status: "CANCEL",
      ended_at: new Date(),
    })
    .where(
      and(
        eq(gameSessionsTable.status, "ACTIVE"),
        eq(gameSessionsTable.player_id, playerId),
      ),
    )
    .returning()
    .then(takeUniqueOrThrow);

  logger.info(
    `Game session ${gameSession.id} cancel successfully`,
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
        eq(gameSessionsTable.status, "ACTIVE"),
      ),
    )
    .returning();

  if (updatedGame.length === 0) {
    throw new Error("No Currently Active Game to Update");
  }

  logger.info(
    `Game session ${updatedGame[updateGame.length - 1].id} update successfully`,
  );
}

export async function finishGame(
  playerId: number,
  score: number,
  playerTotalScore: number,
  lap: number,
  isBoosterReceived: boolean,
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
          eq(gameSessionsTable.status, "ACTIVE"),
        ),
      )
      .returning()
      .then(takeUniqueOrThrow);

    logger.info(`Game session ${game.id} finish successfully`);

    if (isBoosterReceived) {
      await tx.insert(playersBoostersTable).values({
        player_id: playerId,
        booster_id: game.booster_drop_id,
        expired_at: game.booster_drop_duration === null
          ? null
          : addHours(now, game.booster_drop_duration),
        status: "ACTIVE",
      });
    }
    logger.debug(
      `Player_${playerId} booster updated: booster_id_${game.booster_drop_id}`,
    );
    boosterDropId = game.booster_drop_id;
  });

  const newAchievements = await getNewAchievements(playerId);
  const totalGames = await getTotalGames(playerId);
  const gamesPlayedToday = await getGamesPlayedToday(playerId);

  const level = await db
    .select()
    .from(levelsTable)
    .where(lte(levelsTable.score_required, playerTotalScore + score))
    .orderBy(desc(levelsTable.score_required));
  const newLevel = level[0];

  const oldLevel = await getLevelByScore(playerTotalScore);
  const isLevelUp: boolean = newLevel.level !== oldLevel.level.level;
  if (isLevelUp) {
    logger.debug(`Player level up: ${newLevel.level}`);
  }

  await db.transaction(async (tx) => {
    await tx
      .update(playersTable)
      .set({ total_score: playerTotalScore + score })
      .where(eq(playersTable.id, playerId))
      .returning()
      .then(takeUniqueOrThrow);

    // Save received booster from newLevel
    const {
      booster_id_1,
      booster_id_2,
      booster_id_3,
      booster_amount_1,
      booster_amount_2,
      booster_amount_3,
    } = newLevel;

    const isNewLevelGiveBoosters = booster_id_1 && booster_id_2 && booster_id_3;

    if (isLevelUp && isNewLevelGiveBoosters) {
      const boosterArray1 = [...Array(booster_amount_1).keys()].map(() => ({
        player_id: playerId,
        booster_id: booster_id_1,
        status: "ACTIVE" as BoosterStatus,
      }));

      const boosterArray2 = [...Array(booster_amount_2).keys()].map(() => ({
        player_id: playerId,
        booster_id: booster_id_2,
        status: "ACTIVE" as BoosterStatus,
      }));

      const boosterArray3 = [...Array(booster_amount_3).keys()].map(() => ({
        player_id: playerId,
        booster_id: booster_id_3,
        status: "ACTIVE" as BoosterStatus,
      }));

      await tx
        .insert(playersBoostersTable)
        .values([...boosterArray1, ...boosterArray2, ...boosterArray3]);
    }
    logger.debug("Update booster from level up successfully");
  });

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

export async function getTotalEndedGames(playerId: number) {
  const allGames = await db
    .select()
    .from(gameSessionsTable)
    .where(
      and(
        eq(gameSessionsTable.player_id, playerId),
        eq(gameSessionsTable.status, "END"),
      ),
    );
  return allGames.length;
}

export async function getGamesPlayedToday(playerId: number) {
  const allGames = await db
    .select()
    .from(gameSessionsTable)
    .where(eq(gameSessionsTable.player_id, playerId))
    .orderBy(gameSessionsTable.started_at);
  const now = new Date();
  const gamesPlayedToday = allGames.filter((gameSession) =>
    checkToday(gameSession.started_at)
  );
  const gamesPlayedTodayTime = gamesPlayedToday.map((game) => game.started_at);

  return gamesPlayedTodayTime;
}

export async function getLastTwoGames(playerId: number) {
  const gameSessions = await db
    .select()
    .from(gameSessionsTable)
    .where(eq(gameSessionsTable.player_id, playerId))
    .orderBy(desc(gameSessionsTable.started_at));
  return {
    last_played_game_1: gameSessions[0] ?? null,
    last_played_game_2: gameSessions[1] ?? null,
  };
}

export async function getRandomBooster() {
  const allBoosters = await db
    .select()
    .from(boostersTable)
    .where(eq(boostersTable.type, "NORMAL"));
  const boosterId = allBoosters[getRandomInt(allBoosters.length)].id;
  const boosterDuration =
    boosterDurationRandomPool[getRandomInt(boosterDurationRandomPool.length)];
  return { id: boosterId, duration: boosterDuration };
}

export async function getRandomBoss(playerId: number) {
  const player = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.id, playerId))
    .then(takeUniqueOrThrow);
  const totalScore = player.total_score;
  const playerLevel = await db
    .select()
    .from(levelsTable)
    .where(
      and(
        lte(levelsTable.score_required, totalScore),
        isNotNull(levelsTable.boss_id),
      ),
    );
  const bossPoolCount = playerLevel.length;
  const bossPool = bossRandomPool[bossPoolCount];
  return bossPool[getRandomInt(bossPool.length)];
}

export const bossRandomPool = [
  [1],
  [1, 2],
  [1, 2, 3, 3],
  [1, 2, 3, 4, 4],
  [1, 2, 3, 3, 4, 4, 5, 5, 5, 5],
  [1, 2, 3, 4, 4, 5, 5, 6, 6, 6],
];

export const boosterDurationRandomPool = [0, 0, 0, 0, 0, 0, 3, 6, 6, 12];

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export async function checkCanceledGame(playerId: number) {
  const now = new Date();
  const player = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.id, playerId))
    .then(takeUniqueOrThrow);

  await db.transaction(async (tx) => {
    const canceledGameCheck = await tx
      .update(gameSessionsTable)
      .set({
        status: "CANCEL",
        ended_at: now,
      })
      .where(
        and(
          eq(gameSessionsTable.player_id, playerId),
          eq(gameSessionsTable.status, "ACTIVE"),
        ),
      )
      .returning();

    if (canceledGameCheck.length === 0) return;

    const canceledGame = canceledGameCheck[0];

    const newAchievements = await getNewAchievements(playerId);

    const playerTotalScore = player.total_score;
    const score = canceledGame.score;
    logger.debug(`player total score: ${playerTotalScore}`);
    logger.debug(`score: ${score}`);
    const level = await db
      .select()
      .from(levelsTable)
      .where(lte(levelsTable.score_required, playerTotalScore + score))
      .orderBy(desc(levelsTable.score_required));
    logger.debug(`Game Session Service : ${level[0]}`);
    const newLevel = level[0];

    const oldLevel = await getLevelByScore(playerTotalScore);
    const isLevelUp: boolean = newLevel.level !== oldLevel.level;

    await tx
      .update(playersTable)
      .set({ total_score: playerTotalScore + score })
      .where(eq(playersTable.id, playerId))
      .returning()
      .then(takeUniqueOrThrow);
  });
}
