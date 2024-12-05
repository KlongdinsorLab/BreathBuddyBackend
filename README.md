### Install Supabase CLI

MacOS
```sh
$ brew upgrade supabase
```
### Start

```sh
$ supabase start
```

### Status

```sh
$ supabase status
```

Example API URL `http://localhost:54321/functions/v1/<path>`
    
### Serve edge function
```sh
$ supabase functions serve
```

serve with env

```sh
$ supabase functions serve --env-file .env.local
```

### Sync DB
```sh
$ supabase db pull
```

Apply the changes to your local instance
```sh
$ supabase migration up
```

### Reset DB
```sh
$ supabase db reset
```

### Push DB
```sh
$ supabase db push
```

### Run functions

```sh
$ supabase functions serve <function name> --env-file .env.local
```

### Deploy

```sh
$ supabase deploy
```
or
```sh
$ supabase functions deploy <function name> --project-ref dtfbxtfpdfpwflcjxttr
```

<!-- https://www.youtube.com/watch?v=l2KlzGrhB6w -->

https://supabase.com/docs/guides/cli/local-development

### Setup for Production
1. Define these values in Github secrets.
   - SUPABASE_ACCES_TOKEN_PROD
     - This can be found in Account --> Access Tokens in Supabase Dashboard
   - SUPABASE_DB_PASSWORD_PROD
        - This can be found in [Project Name] --> Project Settings --> Configuration --> Database --> Database Password in Supabase Dashboard
   - SUPABASE_PROJECT_ID_PROD
        - To retrieve Project ID, go to dashboard of the Supabase Project. The project ID should be in the URL. (https://supabase.com/dashboard/project/[YOUR PROJECT ID])
   - DATABASE_URL_PROD
        - This can be found in [Project Name] --> Project Settings --> Configuration --> Database --> Connection String --> URI in Supabase Dashboard. Replace [YOUR-PASSWORD] with the actual db password.
   - SENTRY_DSN
        - This can be found in [Project Name] --> Setting --> Client Keys (DSN) --> DSN in Sentry Dashboard.

2. Merge from branch ```develop``` to ```main```.
3. Make sure that ```dbpush``` and ```deploy``` workflows run without any error.
4. Define DATABASE_URL in .env in a local editor.
5. In a local editor, run seed.ts by using command. ```deno run .\supabase\functions\common\seed.ts```
