import { integer, pgTable, serial, text, timestamp, real } from 'drizzle-orm/pg-core';


export const difficultiesTable = pgTable('difficulties_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  inhale_second: real('inhale_second').notNull()
})

export const charactersTable = pgTable('characters_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  achievement_number_required: integer('achievement_number_required').notNull(),
  detail: text('detail')
})

export const playersTable = pgTable('players_table', {
  id: serial('id').primaryKey(),
  firebase_id: text('firebase_id').notNull().unique(),
  phone_number: text('phone_number').notNull().unique(),
  difficulty_id: integer('difficulty_id').notNull()
    .references(() => difficultiesTable.id, { onDelete: 'cascade' }),
  selected_character_id: integer('selected_character_id').notNull()
    .references(() => charactersTable.id, { onDelete: 'cascade' }),
  username: text('username'),
  gender: text('gender', {enum: ["M", "F"] }),
  birth_year: integer('birth_year'),
  airflow: integer('airflow'),
  last_played_at: timestamp('last_played_at'),
  
})

export const vasTable = pgTable('vas_table', {
  id: serial('id').primaryKey(),
  player_id: integer('player_id').notNull()
    .references(() => playersTable.id, { onDelete: 'cascade' }),
  vas_score: integer('vas_score').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow()
})

export const levelsTable = pgTable('levels_table', {
  id: serial('id').primaryKey(),
  level: integer('level').notNull().unique(),
  score_required: integer('score_required').notNull()
})

export const gameSessionsTable = pgTable('game_sessions_table', {
  id: serial('id').primaryKey(),
  player_id: integer('player_id').notNull()
    .references(() => playersTable.id, { onDelete: 'no action' }),

  difficulty_id: integer('difficulty_id').notNull()
    .references(() => difficultiesTable.id,{ onDelete: 'no action' }),

  boss_id: integer('boss_id').notNull()
    .references(() => bossesTable.id, { onDelete: 'no action' }),

  booster_drop_id: integer('booster_drop_id').notNull()
    .references(() => boostersTable.id, { onDelete: 'no action' }),

  booster_drop_duration: integer('booster_drop_duration'),
  score: integer('score'),
  lap: integer('lap'),
  started_at: timestamp('started_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at'),
  ended_at: timestamp('ended_at'),
  status: text('status', {enum: ['END', 'ACTIVE', 'CANCEL'] })
})

export const achievementsTable = pgTable('achievements_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  games_played_in_a_day: integer('games_played_in_a_day'),
  games_played_consecutive_days: integer('games_played_consecutive_days'),
  accumulative_score: integer('accumulative_score'),
  games_played: integer('games_played'),
  boosters_number: integer('boosters_number'), // TODO Booster Amount?
  booster_type: text('booster_type', { enum: ['NORMAL','RARE'] }),

  // TODO better name?
  booster_action: text('booster_action', { enum: ['USE','GAIN'] }),
  booster_unique:text('booster_unique' , { enum: ['UNIQUE','NONUNIQUE'] }),

  boss_id: integer('boss_id')
    .references(() => bossesTable.id,{ onDelete: 'no action' }),

  boss_encounter: integer('boss_encounter'),
  characters_unlocked: integer('characters_unlocked'),
  detail: text('detail')
})

export const boostersTable = pgTable('boosters_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  type: text('type', {enum : ["NORMAL", "RARE"] }).notNull(),
  detail: text('detail')
})

export const playersCharactersTable = pgTable('players_characters_table', {
  id: serial('id').primaryKey(),
  player_id: integer('player_id').notNull()
    .references(() => playersTable.id, { onDelete: 'cascade' }),
  character_id: integer('character_id').notNull()
    .references(() => charactersTable.id, { onDelete: 'cascade' })
})

export const playersAchievementsTable = pgTable('players_achievements_table', {
  id: serial('id').primaryKey(),
  player_id: integer('player_id').notNull()
    .references(() => playersTable.id, { onDelete: 'cascade' }),
  achievement_id: integer('achievement_id').notNull()
    .references(() => achievementsTable.id, { onDelete: 'cascade' })
})

export const playersBoostersTable = pgTable('players_boosters_table', {
  id: serial('id').primaryKey(),
  player_id: integer('player_id').notNull()
    .references(() => playersTable.id, { onDelete: 'cascade' }),
  booster_id: integer('booster_id').notNull()
    .references(() => boostersTable.id, { onDelete: 'cascade' }),
  expired_at: timestamp('expired_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  status: text('status', {enum : ["ACTIVE", "USED"] })
})

export const bossesTable = pgTable('bosses_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  detail: text('detail')
})

/*export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;*/