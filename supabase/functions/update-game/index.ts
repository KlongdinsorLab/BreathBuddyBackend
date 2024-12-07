// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from "../common/_shared/cors.ts"
import { getFirebaseId } from "../common/_shared/authService.ts";
import { eq } from "npm:drizzle-orm@^0.31.4/expressions";
import { takeUniqueOrThrow } from "../common/_shared/takeUniqueOrThrow.ts";
import { db } from "../common/db.ts";
import { playersTable } from "../common/schema.ts";
import { updateGame } from "../common/_shared/gameSessionService.ts";

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try{
    const {score,lap} = await req.json()
    const authHeader = req.headers.get("Authorization")!
    const firebaseId = getFirebaseId(authHeader)
    const player = await db.select().from(playersTable).where(eq(playersTable.firebase_id, firebaseId)).then(takeUniqueOrThrow)
    const playerId = player.id

    await updateGame(playerId,score,lap)
  
    const response = {message : "Ok"}

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
  catch(error){
    const response = {
      message : error.message,
    }
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-game' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/