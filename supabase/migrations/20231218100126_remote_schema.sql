
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."game_session_status" AS ENUM (
    'STARTED',
    'ENDED'
);

ALTER TYPE "public"."game_session_status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."end_game"("p_token" "text", "p_reload_count" boolean) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  selected_player_id uuid;
BEGIN
  SELECT player_id 
  into selected_player_id
  FROM device
  WHERE token = p_token;

  UPDATE game_session 
  SET reload_count = p_reload_count, status = "ENDED"
  WHERE player_id = selected_player_id;
END;$$;

ALTER FUNCTION "public"."end_game"("p_token" "text", "p_reload_count" boolean) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."random_device_token"() RETURNS "text"
    LANGUAGE "sql"
    AS $$
SELECT lower(substr(md5(random()::text), 0, 13));                 
$$;

ALTER FUNCTION "public"."random_device_token"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."start_game"("token" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  selected_player_id uuid;
BEGIN
  SELECT player_id 
  into selected_player_id
  FROM device
  WHERE token = token;

  INSERT INTO game_session (player_id, status) 
  VALUES(selected_player_id, "STARTED");
END;$$;

ALTER FUNCTION "public"."start_game"("token" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."condition" (
    "id" "uuid" NOT NULL,
    "name" character varying NOT NULL,
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);

ALTER TABLE "public"."condition" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."difficulty" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "inhale_millisecond" integer DEFAULT 10000 NOT NULL,
    "times" smallint DEFAULT '10'::smallint NOT NULL,
    "name" "text" NOT NULL,
    "name_th" "text" NOT NULL,
    "boss_millisecond" integer DEFAULT 120000 NOT NULL,
    "boss_multiple_count" smallint DEFAULT '5'::smallint NOT NULL,
    "laser_frequency_millisecond" smallint DEFAULT '500'::smallint NOT NULL,
    "bullet_count" smallint DEFAULT '30'::smallint NOT NULL,
    "reload_count" smallint DEFAULT '10'::smallint NOT NULL
);

ALTER TABLE "public"."difficulty" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."game_session" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "player_id" "uuid" NOT NULL,
    "score" smallint DEFAULT '0'::smallint NOT NULL,
    "start_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "end_at" timestamp with time zone,
    "status" "public"."game_session_status" DEFAULT 'STARTED'::"public"."game_session_status" NOT NULL,
    "difficulty" "uuid" NOT NULL
);

ALTER TABLE "public"."game_session" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."player" (
    "birth_date" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "condition_id" "uuid",
    "gamer_name" "text",
    "phone_number" "text" DEFAULT ''::"text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "difficulty" "uuid" NOT NULL,
    "volume" smallint DEFAULT '0'::smallint NOT NULL,
    "experience" smallint DEFAULT '0'::smallint NOT NULL,
    "country" "text" DEFAULT 'Thailand'::"text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."player" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."set" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "index" smallint NOT NULL,
    "status" "text" NOT NULL,
    "game_session_id" "uuid" NOT NULL,
    "date_time" timestamp with time zone NOT NULL
);

ALTER TABLE "public"."set" OWNER TO "postgres";

ALTER TABLE ONLY "public"."game_session"
    ADD CONSTRAINT "Game Session_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."condition"
    ADD CONSTRAINT "condition_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."difficulty"
    ADD CONSTRAINT "difficulty_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."player"
    ADD CONSTRAINT "player_condition_id_key" UNIQUE ("condition_id");

ALTER TABLE ONLY "public"."player"
    ADD CONSTRAINT "player_phone_number_key" UNIQUE ("phone_number");

ALTER TABLE ONLY "public"."player"
    ADD CONSTRAINT "player_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."set"
    ADD CONSTRAINT "set_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."condition" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."player" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

ALTER TABLE ONLY "public"."game_session"
    ADD CONSTRAINT "game_session_difficulty_fkey" FOREIGN KEY ("difficulty") REFERENCES "public"."difficulty"("id");

ALTER TABLE ONLY "public"."player"
    ADD CONSTRAINT "player_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "public"."condition"("id");

ALTER TABLE ONLY "public"."player"
    ADD CONSTRAINT "player_difficulty_fkey" FOREIGN KEY ("difficulty") REFERENCES "public"."difficulty"("id");

ALTER TABLE ONLY "public"."set"
    ADD CONSTRAINT "set_game_session_id_fkey" FOREIGN KEY ("game_session_id") REFERENCES "public"."game_session"("id");

ALTER TABLE "public"."condition" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."difficulty" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."game_session" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."player" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."set" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."end_game"("p_token" "text", "p_reload_count" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."end_game"("p_token" "text", "p_reload_count" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."end_game"("p_token" "text", "p_reload_count" boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."random_device_token"() TO "anon";
GRANT ALL ON FUNCTION "public"."random_device_token"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."random_device_token"() TO "service_role";

GRANT ALL ON FUNCTION "public"."start_game"("token" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."start_game"("token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."start_game"("token" "text") TO "service_role";

GRANT ALL ON TABLE "public"."condition" TO "anon";
GRANT ALL ON TABLE "public"."condition" TO "authenticated";
GRANT ALL ON TABLE "public"."condition" TO "service_role";

GRANT ALL ON TABLE "public"."difficulty" TO "anon";
GRANT ALL ON TABLE "public"."difficulty" TO "authenticated";
GRANT ALL ON TABLE "public"."difficulty" TO "service_role";

GRANT ALL ON TABLE "public"."game_session" TO "anon";
GRANT ALL ON TABLE "public"."game_session" TO "authenticated";
GRANT ALL ON TABLE "public"."game_session" TO "service_role";

GRANT ALL ON TABLE "public"."player" TO "anon";
GRANT ALL ON TABLE "public"."player" TO "authenticated";
GRANT ALL ON TABLE "public"."player" TO "service_role";

GRANT ALL ON TABLE "public"."set" TO "anon";
GRANT ALL ON TABLE "public"."set" TO "authenticated";
GRANT ALL ON TABLE "public"."set" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
