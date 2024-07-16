// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { getFirebaseId } from "../authFunctions.ts";
import { db } from "../common/db.ts";
import { charactersTable, playersCharactersTable, playersTable } from "../common/schema.ts";
import { eq } from "npm:drizzle-orm@^0.31.2/expressions";

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const firebaseId = getFirebaseId(req.headers.get('Authorization')!)
  const player = (await db.select().from(playersTable)
    .where(eq(playersTable.firebase_id,firebaseId))
    .limit(1))[0]

  const playerId = player.id
  const characterIdList = await db.select().from(playersCharactersTable)
    .where(eq(playersCharactersTable.player_id,playerId))

  const result = []
  for(let i = 0; i < characterIdList.length; i++) {
    result.push((await db.select().from(charactersTable)
      .where(eq(charactersTable.id,characterIdList[i].character_id)))[0])
  }



  const response = {
    status : 200,
    message : "Ok",
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-unlocked-characters' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/