// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getFirebaseId } from "../common/_shared/authService.ts";
import { db } from "../common/db.ts";
import { gameSessionsTable, playersTable, vasTable } from "../common/schema.ts";
import { eq } from "npm:drizzle-orm@^0.31.4/expressions";
import { takeUniqueOrThrow } from "../common/_shared/takeUniqueOrThrow.ts";
import { corsHeaders } from "../common/_shared/cors.ts";
import { logger } from "../common/logger.ts";
import * as Sentry from "https://deno.land/x/sentry@8.41.0-beta.1/index.mjs";

Sentry.init({
  // https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/#where-to-find-your-dsn
  dsn: Deno.env.get("SENTRY_DSN"),
  debug: true,
  defaultIntegrations: false,
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  // profilesSampleRate: 1.0,
});

// Set region and execution_id as custom tags
Sentry.setTag("region", Deno.env.get("SB_REGION") || "unknown");
Sentry.setTag("execution_id", Deno.env.get("SB_EXECUTION_ID") || "unknown");

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const loggedRequest = req.clone();
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

    logger.debug(`totalVas: ${totalVas}`);
    logger.debug(`totalIdealVas:  ${totalIdealVas}`);

    if (totalIdealVas <= totalVas) {
      throw new Error(
        "You need to complete more game sessions to submit your VAS score",
      );
    }

    while (totalIdealVas - 1 > totalVas) {
      await db.insert(vasTable).values({ player_id: playerId, vas_score: 0 });
      logger.debug(`totalVas in while loop: ${totalVas}`);
      totalVas += 1;
    }

    await db.insert(vasTable).values({ player_id: playerId, vas_score: vas });
    const response = { message: "OK" };

    logger.info(
      `API call to ${loggedRequest.url} with method ${loggedRequest.method}. Data modification performed. Request details: ${
        JSON.stringify(loggedRequest.json())
      }`,
    );

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Error occurred while processing request", error);
    Sentry.captureException(error);
    Sentry.setContext("http", {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
    });

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
