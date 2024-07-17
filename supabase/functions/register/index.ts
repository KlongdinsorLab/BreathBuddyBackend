// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { db } from "../common/db.ts";
import { charactersTable, difficultiesTable, playersCharactersTable, playersTable } from "../common/schema.ts";
import { eq } from "npm:drizzle-orm@^0.31.2/expressions";
import { getFirebaseId } from "../_shared/authFunctions.ts";

console.log("Hello from Functions!")

Deno.serve(async (req) => {

  // TODO Get Phone Number from token?
  const { phone_number } = await req.json()
  const authHeader = await req.headers.get("Authorization")!
  const firebaseId = getFirebaseId(authHeader)
  
  const userCheck = await db.select().from(playersTable).where(eq(playersTable.firebase_id,firebaseId)).limit(1)

  if(userCheck.length > 0) {
    // TODO Error Status
    const data = {message: "User Already Exist."}
    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } },
    )
  }

  // get easy difficulty
  const easyObj = await db.select().from(difficultiesTable).where(eq(difficultiesTable.name,"Easy")).limit(1)
  const easyId = easyObj[0].id

  // get adventurer character
  const advObj = await db.select().from(charactersTable).where(eq(charactersTable.name,"Adventurer")).limit(1)
  const advId = advObj[0].id

  await db.insert(playersTable).values({
    firebase_id: firebaseId,
    phone_number: phone_number,
    difficulty_id: easyId,
    using_character_id: advId,
  })


  const player = (await db.select().from(playersTable).where(eq(playersTable.firebase_id,firebaseId)).limit(1))[0]
  await db.insert(playersCharactersTable).values({
    player_id : player.id,
    character_id : advId
  })


  const result = player
  const response = {
    status : 200,
    message: "Ok",
    result : result
  }
  return new Response(
    JSON.stringify(response),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/register' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
