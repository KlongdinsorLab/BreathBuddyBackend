// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { db } from "../common/db.ts";
import { difficultiesTable } from "../common/schema.ts";

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  await db.insert(difficultiesTable).values({
    name: "Easy",
    inhale_second: 0.5
  })
  await db.insert(difficultiesTable).values({
    name: "Normal",
    inhale_second: 1
  })
  await db.insert(difficultiesTable).values({
    name: "Hard",
    inhale_second: 2
  })
  

  const data = await db.select().from(difficultiesTable)
  

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add-difficulty' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/