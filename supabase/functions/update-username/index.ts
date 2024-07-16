// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { getFirebaseId } from "../authFunctions.ts";
import { db } from "../common/db.ts";
import { playersTable } from "../common/schema.ts";
import { eq } from "npm:drizzle-orm@^0.31.2/expressions";

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  try{
    const { username } = await req.json()

    if(username.length > 20) {
      // TODO Error Status
      const response = {message: "Invalid username"}
      return new Response(
        JSON.stringify(response),
        { headers: { "Content-Type": "application/json" } },
      )
    }

    const authHeader = req.headers.get("Authorization")!
    const firebaseId = getFirebaseId(authHeader)

    await db.update(playersTable).set( {username : username} ).where(eq(playersTable.firebase_id,firebaseId))
  
    const result = (await db.select().from(playersTable).where(eq(playersTable.firebase_id,firebaseId)))[0]

    const response = {
      status : 200,
      message : "Ok",
      result : result
    }

    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } },
    )
  }
  catch(e){
    return new Response(
      JSON.stringify({ status : e.status, message : e.message}),
      { headers: { "Content-Type": "application/json" } },
    )
  }
  
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-username' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
