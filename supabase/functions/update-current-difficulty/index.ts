// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { db } from "../common/db.ts";
import { getFirebaseId } from "../authFunctions.ts";
import { difficultiesTable, playersTable } from "../common/schema.ts";
import { eq } from "npm:drizzle-orm@^0.31.2/expressions";

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { difficultyId } = await req.json()
  const firebaseId = getFirebaseId(req.headers.get('Authorization')!)
  await db.update(playersTable).set({difficulty_id : difficultyId}).where(eq(playersTable.firebase_id,firebaseId))


  const player = ( await db.select().from(playersTable).where(eq(playersTable.firebase_id,firebaseId)) )[0]
  const difficulty = ( await db.select().from(difficultiesTable).where(eq(difficultiesTable.id,difficultyId)) )[0]
  const result = { player, difficulty}

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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-current-difficulty' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
