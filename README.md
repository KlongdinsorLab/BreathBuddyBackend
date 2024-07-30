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

### Seeding

```sh
$ deno run .\supabase\functions\common\seed.ts
```

And define "SUPABASE_URL" and "SUPABASE_DB_URL" in .env file