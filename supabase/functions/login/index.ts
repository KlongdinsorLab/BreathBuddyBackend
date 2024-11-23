// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  getFirebaseId,
  getPhoneNumber,
  login,
} from "../common/_shared/authService.ts";
import { corsHeaders } from "../common/_shared/cors.ts";
import { logger } from "../common/logger.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phoneNumber } = await req.json();
    const authHeader = req.headers.get("Authorization")!;
    const firebaseId = getFirebaseId(authHeader);

    if (phoneNumber !== getPhoneNumber(authHeader)) {
      throw new Error("Authentication Error");
    }

    await login(firebaseId, phoneNumber);

    const response = {
      message: "Ok",
      response: authHeader.replace("Bearer ", ""),
    };

    logger.info(
      `API call to ${req.url} with method ${req.method}. Data modification performed. Request details: ${req.json()}`,
    );

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Error occurred while processing request", error);

    const response = {
      message: error.message,
    };
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/login' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
