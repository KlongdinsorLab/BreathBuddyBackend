import { integer, pgTable, serial, text, timestamp, real } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const difficultiesTable = pgTable('difficulties_table', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    inhale_second: real('inhale_second').notNull()
})

export const charactersTable = pgTable('characters_table', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    achievement_required_number: integer('achievement_required_number').notNull(),
    detail: text('detail')
})

export const playersTable = pgTable('players_table', {
    id: serial('id').primaryKey(),
    firebase_id: text('firebase_id').unique(),
    phone_number: text('phone_number').notNull().unique(),
    difficulty_id: integer('difficulty_id').notNull()
      .references(() => difficultiesTable.id, { onDelete: 'cascade' }),
    username: text('username'),
    gender: text('gender', {enum: ["Male", "Female"] }),
    birth_year: integer('birth_year'),
    airflow: integer('airflow'),
    last_played_at: timestamp('last_played_at'),
    using_character_id: integer('using_character_id').notNull()
      .references(() => charactersTable.id, { onDelete: 'cascade' })
})

export const vasTable = pgTable('vas_table', {
    id: serial('id').primaryKey(),
    player_id: integer('player_id').notNull()
        .references(() => playersTable.id, { onDelete: 'cascade' }),
    vas_score: integer('vas_score').notNull(),
    create_at: timestamp('create_at').notNull().defaultNow()
})

export const levelsTable = pgTable('levels_table', {
    id: serial('id').primaryKey(),
    level: integer('level').notNull().unique(),
    score_require: integer('score_require').notNull()
})

export const gameSesstionsTable = pgTable('game_sessions_table', {
    id: serial('id').primaryKey(),
    player_id: integer('player_id').notNull()
        .references(() => playersTable.id, { onDelete: 'no action' }),

    difficulty_id: integer('difficulty_id').notNull()
        .references(() => difficultiesTable.id,{ onDelete: 'no action' }),

    boss_id: integer('boss_id').notNull()
        .references(() => bossesTable.id, { onDelete: 'no action' }),

    booster_drop_id: integer('booster_drop_id').notNull()
        .references(() => boostersTable.id, { onDelete: 'no action' }),

    score: integer('score'),
    lap: integer('lap'),
    start_at: timestamp('start_at').notNull().defaultNow(),
    update_at: timestamp('update_at'),
    end_at: timestamp('end_at'),
    status: text('status', {enum: ['isWon', 'isCancel'] })
})



export const achievementsTable = pgTable('achievements_table', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    detail: text('detail')
})

export const boostersTable = pgTable('boosters_table', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
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
    expire_at: timestamp('expire_at'),
    create_at: timestamp('create_at').notNull().defaultNow(),
    status: text('status', {enum : ["ready", "used"] })
})

export const bossesTable = pgTable('bosses_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  detail: text('detail')
})
/*export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;*/