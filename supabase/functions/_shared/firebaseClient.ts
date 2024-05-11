// Firebase uses XMLHttpRequest instead of `fetch()`, so we need to provide a
// polyfill for it.
import "https://deno.land/x/xhr@0.1.1/mod.ts";

// Firebase for the web by default stores authenticated sessions in
// localStorage.  This polyfill will allow us to "extract" the localStorage and
// send it to the client as cookies.
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";

// Since Deploy is browser-like, we will use the Firebase web client libraries
// importing in just what we need for this tutorial. We are using the Skypack
// CDN which also provides modules as ES Modules.
// @deno-types="https://cdn.skypack.dev/-/firebase@v8.7.0-MrU9zUCxcEMCl2U7Tuz6/dist=es2020,mode=types/index.d.ts"
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
//import "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import admin from "npm:firebase-admin";


installGlobals();

// https://deno.com/examples/firebase.js


//export function init() {
//    const FIREBASE_PROJECT_ID = Deno.env.get('FIREBASE_PROJECT_ID');
//
//    const firebaseConfig = {
//        apiKey: Deno.env.get('FIREBASE_API_KEY') ?? '',
//        authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
//        projectId: FIREBASE_PROJECT_ID,
//    };
//    const auth = initializeApp(firebaseConfig);
//}

//export async function verifyToken(idToken: string) {
//    try {
//        const decodedToken = await getAuth().verifyIdToken(idToken)
//        const uid = decodedToken.uid;
//    } catch (e) {
//        // Handle error
//    }
//}

export async function verify(idToken: string) {
    const FIREBASE_PROJECT_ID = Deno.env.get('FIREBASE_PROJECT_ID');
    console.log(FIREBASE_PROJECT_ID)
    
    

    const firebaseConfig = {
//        apiKey: Deno.env.get('FIREBASE_API_KEY') ?? '',
//        authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: FIREBASE_PROJECT_ID,
        serviceAccount: "serviceAccountCredentials.json"
    };
    console.log(firebaseConfig)
//    initializeApp(firebaseConfig);
//    const auth = getAuth()
    
    const app = admin.initializeApp(firebaseConfig, 'admin');
    console.log(app)
//    const auth = firebase.auth(firebaseApp);
    
    try {
        const decodedToken = await app.auth().verifyIdToken(idToken)
        const uid = decodedToken.uid;
        console.log(uid)
    } catch (e) {
        console.log(e)
        // Handle error
    }
}

//https://docs.deno.com/deploy/tutorials/tutorial-firebase#setup-firebase

//https://firebase.google.com/docs/admin/setup

// https://stackoverflow.com/questions/50272165/firebase-import-service-throws-error