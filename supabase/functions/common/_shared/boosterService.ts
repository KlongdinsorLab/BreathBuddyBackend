import { db } from "../db.ts";
import { playersBoostersTable } from "../schema.ts";
import { and, eq, desc, gt, or, isNull } from "npm:drizzle-orm@^0.31.4/expressions";
import { playersBoostersInterface } from "./interfaces.ts"

// Booster Bag and Redeem Booster use different JSON formats
export async function getBoosterRedeem(playerId : number) {
    const now = new Date()
    const playerBoostersList = await db.select()
        .from(playersBoostersTable)
        .where(and (
            eq(playersBoostersTable.player_id,playerId),
            eq(playersBoostersTable.status, "ACTIVE"),
            or(
                isNull(playersBoostersTable.expired_at),
                gt(playersBoostersTable.expired_at,now)
            )
        ))
        .orderBy(playersBoostersTable.expired_at)
    console.log(playerBoostersList)
    
    const boosterListJson = [
        {boosterId : 1, expireDate: <Date[]> [], amount: 0},
        {boosterId : 2, expireDate: <Date[]> [], amount: 0},
        {boosterId : 3, expireDate: <Date[]> [], amount: 0},
        {boosterId : 4, expireDate: <Date[]> [], amount: 0},
        {boosterId : 5, expireDate: <Date[]> [], amount: 0},
        {boosterId : 6, expireDate: <Date[]> [], amount: 0},
        {boosterId : 7, expireDate: <Date[]> [], amount: 0},
    ]

    playerBoostersList.forEach( (element : playersBoostersInterface) => {
        if(element.expired_at !== null) boosterListJson[element.booster_id - 1].expireDate.push(element.expired_at)

        boosterListJson[element.booster_id - 1].amount += 1
    });

    return boosterListJson
}

export async function getBoosterBag(playerId : number) {
    const now = new Date()
    const playerBoostersList = await db.select()
        .from(playersBoostersTable)
        .where(and (
            eq(playersBoostersTable.player_id,playerId),
            eq(playersBoostersTable.status, "ACTIVE"),
            or(
                isNull(playersBoostersTable.expired_at),
                gt(playersBoostersTable.expired_at,now)
            )
        ))
        .orderBy(desc(playersBoostersTable.expired_at))
    return playerBoostersList
}

export async function useBooster(playerId : number, boosterId : number) {
    const now = new Date()

    const availableBoosters = await db.select()
        .from(playersBoostersTable)
        .where(and (
            eq(playersBoostersTable.player_id, playerId),
            eq(playersBoostersTable.status, "ACTIVE"),
            eq(playersBoostersTable.booster_id, boosterId),
            or(
                isNull(playersBoostersTable.expired_at),
                gt(playersBoostersTable.expired_at,now)
            )
        ))
        .orderBy(playersBoostersTable.expired_at)

    console.log(availableBoosters)

    if(availableBoosters.length === 0) 
        throw new Error("No booster to use")
    
    await db.update(playersBoostersTable)
        .set({status : 'USED'})
        .where(eq(playersBoostersTable.id, availableBoosters[0].id))
}