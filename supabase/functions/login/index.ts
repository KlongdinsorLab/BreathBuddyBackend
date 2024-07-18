// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { getFirebaseId, getPhoneNumber } from "../_shared/authFunctions.ts";
import { db } from "../common/db.ts";
import { playersTable } from "../common/schema.ts";
import { eq } from "npm:drizzle-orm@^0.31.2/expressions";

console.log("Hello from Functions!")

async function login(firebaseId : string, phoneNumber : string) {
  const players = await db.select()
    .from(playersTable)
    .where(eq(playersTable.phone_number, phoneNumber))

  if(players.length < 1){
    throw new Error("No existing player")
  }

  if(players.length > 1){
    // TODO handle duplicate players
  }

  const player = players[0]

  if(player.firebase_id !== firebaseId){
    throw new Error("Authentication Error")
  }

  // TODO check expire date
  
  return
}

Deno.serve(async (req) => {
  try{
    const { phoneNumber } = await req.json()
    const authHeader = req.headers.get("Authorization")!
    const firebaseId = getFirebaseId(authHeader)

    if(phoneNumber !== getPhoneNumber(authHeader)) {
      throw new Error("Authentication Error")
    }
  
    await login(firebaseId, phoneNumber)

    const response = {
      message : "Ok",
      response : authHeader.replace("Bearer ","")
    }
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/login' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
