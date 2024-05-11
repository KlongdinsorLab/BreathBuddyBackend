// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Firebase auth
//import { getResponse,corsHeaders, supabaseClient } from '../_shared/supabaseClient'

import {getResponse, corsHeaders, supabaseClient} from '../_shared/supabaseClient.ts'
import {verify} from '../_shared/firebaseClient.ts'

Deno.serve(async (req) => {
    const {url, method} = req

    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }
    
    await verify('ssss');
//    verifyToken();

    if (req.method === 'POST') {
        const {name, cat} = await req.json()
        const data = {
            message: `Hello ${name}! ${cat}`,
        }
        return getResponse(200, data)
    }

    if (req.method === 'GET') {
        const taskPattern = new URLPattern({pathname: '/users/:id'})
        const matchingPath = taskPattern.exec(url)
        const id = matchingPath ? matchingPath.pathname.groups.id : null
        
        return getResponse(200, id)
    }

//  supabaseClient


//  POST
    // RegisterUser
    // Check if user is verified
    // age, gender, airflow, difficulty

    // RegisterName -> firebase
    // name

    // Set User HighScore
    // /user/:id/highscore

// GET
    // User detail
    // /user/:id/

    // Get User HighScore
    // /user/:id/highscore?difficulty=easy, medium, hard

    // User achievement
    // /user/:id/achievement

})

//curl --location --request GET 'http://localhost:54321/functions/v1/users/10' \
//--header 'Content-Type: application/json' \
//--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU' \
//--data '{"name": "hi", "cat": "cat"}'
