// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { db } from "../common/db.ts"
import { charactersTable, playersCharactersTable, playersTable } from "../common/schema.ts";
import { eq } from "npm:drizzle-orm@^0.31.2/expressions";
import { takeUniqueOrThrow } from "../_shared/takeUniqueOrThrow.ts";
import { getFirebaseId, getPhoneNumber } from "../_shared/authFunctions.ts";

console.log("Hello from Functions!")

async function register(firebaseId : string, phoneNumber: string, age : number, gender : string, airflow : number, difficultyId : number) {

  // get adventurer character
  const advObj = await db.select()
    .from(charactersTable)
    .where(eq(charactersTable.name,"Adventurer"))
    .then(takeUniqueOrThrow)

  const advId = advObj.id ?? 1

  const newPlayer = await db.transaction( async (tx) => {
    const player = await tx.insert(playersTable).values({
      firebase_id : firebaseId,
      phone_number : phoneNumber,
      difficulty_id : difficultyId ?? 1,

      // TODO consider again about ?? 1 part
      using_character_id : advId,
      gender : (gender === 'M') ? 'Male' : (gender === 'F' ? 'Female' : null),
      airflow : ( airflow < 100 || airflow > 600 || airflow%100 !== 0 ) ? airflow : null,

      // TODO fix birth year
      birth_year : 2024 - age
    })
    .returning({player_id : playersTable.id})

    const playerId = takeUniqueOrThrow(player).player_id

    await tx.insert(playersCharactersTable).values({
      player_id : playerId,
      character_id : advId ?? 1
    })
    return player
  })

  if (newPlayer.length > 0) {
    const response = {
      message : "Ok"  
    }
    return response
  }
  else {
    // TODO come up with a better error message
    throw new Error("Database Error")
  }
}

Deno.serve(async (req) => {
  try{
    const { phoneNumber, age, gender, airflow, difficultyId } = await req.json()
    const authHeader = req.headers.get("Authorization")!
    const firebaseId = getFirebaseId(authHeader)

    if(phoneNumber !== getPhoneNumber(authHeader)) {
      throw new Error("Authentication Error")
    }
  
    const response = await register(firebaseId, phoneNumber, age, gender, airflow, difficultyId)

    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } },
    )
  }
  catch(error){
    const response = {
      status : error.status,
      message : error.message,
    }
    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } },
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/register' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
