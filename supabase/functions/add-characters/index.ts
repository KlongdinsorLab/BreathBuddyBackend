// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { db } from "../common/db.ts";
import { charactersTable } from "../common/schema.ts";

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  await db.insert(charactersTable).values({
    name: "นักผจญภัย",
    detail: "นักสู้กู้ภัย ไม่เป็นสองรองใคร",
    achievement_required_number: 0
  })
  await db.insert(charactersTable).values({
    name: "นักเวทย์",
    detail: "เวทย์มนต์ไม่ใช่ของตั้งโชว์นะ",
    achievement_required_number: 0
  })
  await db.insert(charactersTable).values({
    name: "จอมโจร",
    detail: "สมบัติของเธอ ขอรับไปละนะ",
    achievement_required_number: 0
  })

  const data = await db.select().from(charactersTable)

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add-characters' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
