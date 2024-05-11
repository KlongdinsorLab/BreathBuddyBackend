-- Define the new "enum" type
create or replace type game_session_status as enum('STARTED', 'ENDED');

-- Create Player Table
create or replace table
  public.player (
    id uuid not null,
    first_name character varying null default ''::character varying,
    last_name character varying null default ''::character varying,
    birth_date timestamp with time zone null,
    created_at timestamp with time zone not null default (now() at time zone 'utc'::text),
    condition_id uuid null,
    gamer_name text null,
    constraint player_pkey primary key (id),
    constraint player_condition_id_key unique (condition_id),
    constraint player_id_key unique (id),
    constraint player_condition_id_fkey foreign key (condition_id) references condition (id),
    constraint player_id_fkey foreign key (id) references auth.users (id)
  ) tablespace pg_default;

create or replace trigger handle_updated_at before
update on player for each row
execute function moddatetime ('updated_at');

-- Create Game Session Table
create or replace table
  public.game_session (
    id uuid not null default gen_random_uuid (),
    player_id uuid null,
    score smallint null,
    reload_count smallint null,
    start_at timestamp with time zone null default (now() at time zone 'utc'::text),
    end_at timestamp with time zone null,
    status public.game_session_status not null default 'STARTED'::game_session_status,
    constraint Game Session_pkey primary key (id),
    constraint game_session_player_id_fkey foreign key (player_id) references player (id)
  ) tablespace pg_default;
  
-- Create Condition table
create or replace table
  public.condition (
    id uuid not null,
    type character varying null,
    severity smallint not null default '0'::smallint,
    care_provider uuid null,
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    created_at timestamp with time zone null default (now() at time zone 'utc'::text),
    constraint condition_pkey primary key (id),
    constraint condition_care_provider_fkey foreign key (care_provider) references auth.users (id),
    constraint condition_id_fkey foreign key (id) references player (id) on delete cascade
  ) tablespace pg_default;

create or replace trigger handle_updated_at before
update on condition for each row
execute function moddatetime ('updated_at');

-- Create Device
CREATE OR REPLACE FUNCTION random_device_token() RETURNS TEXT as $$
SELECT lower(substr(md5(random()::text), 0, 13));                 
$$ language sql; 

create or replace table
  public.device (
    player_id uuid not null,
    token text not null default random_device_token (),
    created_at timestamp with time zone null default now(),
    constraint device_pkey primary key (token),
    constraint device_player_id_fkey foreign key (player_id) references player (id)
  ) tablespace pg_default;
  
-- Create Start Game function
CREATE FUNCTION start_game(p_token text) RETURNS void AS $$
    DECLARE
      selected_player_id uuid;
    BEGIN
      SELECT player_id 
      into selected_player_id
      FROM device
      WHERE token = p_token;

      INSERT INTO game_session (player_id, status) 
      VALUES(selected_player_id, "STARTED");
    END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER;
   
-- Create End Game function
CREATE FUNCTION end_game(p_token text, p_reload_count int) RETURNS void AS $$
    DECLARE
      selected_player_id uuid;
    BEGIN
      SELECT player_id 
      into selected_player_id
      FROM device
      WHERE token = p_token;

      UPDATE game_session 
      SET reload_count = p_reload_count, status = "ENDED"
      WHERE player_id = selected_player_id;
    END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER;
   
-- Create Init User function
TODO

-- Create Global Highscore View
TODO