// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getFirebaseId } from "../common/_shared/authService.ts";
import { db } from "../common/db.ts";
import { playersTable, vasTable, gameSessionsTable } from "../common/schema.ts";
import { eq } from "npm:drizzle-orm@^0.31.4/expressions";
import { takeUniqueOrThrow } from "../common/_shared/takeUniqueOrThrow.ts";
import { updateAirflow } from "../common/_shared/playerService.ts";
import { corsHeaders } from "../common/_shared/cors.ts";
import { logger } from "../common/logger.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { vas } = await req.json();
    const authHeader = req.headers.get("Authorization")!;
    const firebaseId = getFirebaseId(authHeader);
    const player = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.firebase_id, firebaseId))
      .then(takeUniqueOrThrow);
    const playerId = player.id;

    const gameSessions = await db
      .select()
      .from(gameSessionsTable)
      .where(eq(gameSessionsTable.player_id, playerId));
    const totalGameSessions = gameSessions.length;
    const totalIdealVas = Math.floor(totalGameSessions / 10);
    const vases = await db
      .select()
      .from(vasTable)
      .where(eq(vasTable.player_id, playerId));
    let totalVas = vases.length;

    console.log("totalVas: ", totalVas);
    console.log("totalIdealVas: ", totalIdealVas);
    if (totalIdealVas <= totalVas) {
      throw new Error(
        "You need to complete more game sessions to submit your VAS score"
      );
    }

    while (totalIdealVas - 1 > totalVas) {
      await db.insert(vasTable).values({ player_id: playerId, vas_score: 0 });
      console.log("totalVas in while loop: ", totalVas);
      totalVas += 1;
    }

    await db.insert(vasTable).values({ player_id: playerId, vas_score: vas });
    const response = { message: "OK" };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Error occurred while processing request", error);

    const response = { message: error.message };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/insert-vas' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
