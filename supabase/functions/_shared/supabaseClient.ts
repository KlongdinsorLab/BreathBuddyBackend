//https://supabase.com/docs/reference/javascript/typescript-support

//https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/select-from-table-with-auth-rls/index.ts
//https://github.com/supabase/cli/issues/1093
//import {createClient} from '@supabase/supabase-js'
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'
//import {Database} from './database.types'

export const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)

// idToken comes from the client app

// process.env.SUPABASE_URL,
// process.env.SUPABASE_ANON_KEY

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

export const getResponse = (status: number, data: {}): Response => {
    return new Response(
        JSON.stringify(data),
        {
            headers: {...corsHeaders, 'Content-Type': 'application/json'},
            status: status,
        },
    )
}