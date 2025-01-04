import { db } from "../db.ts";
import { playersCharactersTable, playersTable } from "../schema.ts";
import { takeUniqueOrThrow } from "./takeUniqueOrThrow.ts";
import { eq } from "npm:drizzle-orm@^0.31.2/expressions";

export async function register(
  firebaseId: string,
  phoneNumber: string,
  age: number,
  gender: string,
  airflow: number,
  difficultyId: number,
) {
  const newPlayer = await db.transaction(async (tx) => {
    const player = await tx
      .insert(playersTable)
      .values({
        firebase_id: firebaseId!,
        phone_number: phoneNumber!,
        difficulty_id: difficultyId! ?? 1,

        // TODO consider again about ?? 1 part
        selected_character_id: 1,
        gender: gender === "M" ? "M" : gender === "F" ? "F" : null,
        airflow:
          airflow < 100 || airflow > 600 || airflow % 100 !== 0
            ? null
            : airflow,

        // TODO fix birth year
        birth_year: 2024 - age!,
      })
      .returning({ player_id: playersTable.id });

    const playerId = takeUniqueOrThrow(player).player_id;

    await tx.insert(playersCharactersTable).values({
      player_id: playerId,
      character_id: 1,
    });
    return player;
  });

  if (newPlayer.length > 0) {
    const response = {
      message: "Ok",
    };
    return response;
  } else {
    // TODO come up with a better error message
    throw new Error("Database Error");
  }
}

export async function login(firebaseId: string, phoneNumber: string) {
  const players = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.phone_number, phoneNumber));

  if (players.length < 1) {
    // No existing player
    return false
  }

  if (players.length > 1) {
    // Duplicate Player
    throw new Error("Authentication Error")
  }

  const player = players[0];

  if (player.firebase_id !== firebaseId) {
    throw new Error("Authentication Error");
  }

  // TODO check expire date

  return true;
}

export function getFirebaseId(authHeader: string): string {
  const payload = authHeader.split(".")[1];
  const decodedPayload = atob(payload);
  const jsonPayload = JSON.parse(decodedPayload);
  const firebaseId = jsonPayload.user_id;
  return firebaseId;
}

export function getPhoneNumber(authHeader: string): string {
  const payload = authHeader.split(".")[1];
  const decodedPayload = atob(payload);
  const jsonPayload = JSON.parse(decodedPayload);
  const phoneNumber = jsonPayload.phone_number;
  return phoneNumber;
}
