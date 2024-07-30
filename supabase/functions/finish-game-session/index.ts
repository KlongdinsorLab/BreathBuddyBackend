// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { db } from "../common/db.ts";
import { gameSessionsTable } from "../common/schema.ts"
import { eq } from "npm:drizzle-orm@^0.31.2/expressions"

Deno.serve(async (req) => {
  const { method } = await req;

  if (method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { 
    gameSessionId,
    score,
    lap,
    isReceiveBooster
  } = await req.json()

  // Validate required fields
  if (
    gameSessionId === undefined ||
    score === undefined ||
    lap === undefined ||
    isReceiveBooster === undefined
  ) {
    return new Response(JSON.stringify({ error: "Required fields: gameSessionId, score, lap and isReceiveBooster" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // todo check type parameter fields

  if (lap < 10) {
    return new Response(JSON.stringify({ error: "This game session is not finishing. (Lap < 10)" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const now = new Date();

  const level = null  // todo new levelup
  const boosterByLevelUpId: never[] = [] // todo get boosterByLevelUp
  const achievementUnlockedId: never[] = [] // todo get achievementUnlock

  // todo get game session

  // todo check conditions
  // todo eg.1 status === "ACTIVE"? 

  if (isReceiveBooster) {
    // todo addBooster
  }

  // update
  try {
    await db.transaction(async (trx) => {
      const result = await trx.update(gameSessionsTable)
      .set({
        score: score,
        lap: lap,
        ended_at: now,
        updated_at: now,
        status: "END"
      })
      .where(eq(gameSessionsTable.id, gameSessionId))
      .returning();
     
      // Check if no rows were affected
      if (result.length === 0) {
        throw new Error("Game session ID not found");
        
      }
    })
  } catch (error) {
    if (error.message === "Game session ID not found") {
      return new Response(JSON.stringify({ error: "Game session ID not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Handle other errors
      return new Response(JSON.stringify({ error: "An unexpected error occurred: " + error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  
  const response: {
    level: number | null,
    boosterByLevelUpId: number[],
    achievementUnlockedId: number[]
  } = {
    level: level,
    boosterByLevelUpId: boosterByLevelUpId,
    achievementUnlockedId: achievementUnlockedId
  }

  const data = {
    message: `OK`,
    response: response
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/finish-game-session' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
