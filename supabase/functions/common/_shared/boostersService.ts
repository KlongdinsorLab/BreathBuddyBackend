import { and, eq } from "npm:drizzle-orm@^0.31.2/expressions";
import { db } from "../db.ts";
import { playersBoostersTable } from "../schema.ts";

export const getReceivedBoosters = async (playerId: number) => {
  // for My Bag page
  const boosters = await db
    .select()
    .from(playersBoostersTable)
    .where(
      and(
        eq(playersBoostersTable.player_id, playerId),
        eq(playersBoostersTable.status, "ACTIVE"),
      ),
    );

  return boosters;
};
