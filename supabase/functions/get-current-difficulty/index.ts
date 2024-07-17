// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { getFirebaseId } from "../_shared/authFunctions.ts";
import { takeUniqueOrThrow } from "../_shared/takeUniqueOrThrow.ts";
import { db } from "../common/db.ts";
import { difficultiesTable, playersTable } from "../common/schema.ts";
import { eq } from "npm:drizzle-orm@^0.31.2/expressions";

console.log("Hello from Functions!")

async function getCurrentDifficulty(firebaseId : string) {
  const result = await db.select({
      id : difficultiesTable.id,
      name : difficultiesTable.name,
      inhale_second : difficultiesTable.inhale_second
    }).from(difficultiesTable)
    .innerJoin(playersTable, eq(difficultiesTable.id, playersTable.difficulty_id))
    .where(eq(playersTable.firebase_id, firebaseId))
    .then(takeUniqueOrThrow)

  const response = {
    status : 200,
    message : "Ok",
    response : result
  }

  return response
}

Deno.serve(async (req) => {
  try{
    const firebaseId = getFirebaseId(req.headers.get('Authorization')!)
    const response = await getCurrentDifficulty(firebaseId)

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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-current-difficulty' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
