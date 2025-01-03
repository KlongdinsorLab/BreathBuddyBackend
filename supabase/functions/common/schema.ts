import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["M", "F"]);
export const gameSessionStatusEnum = pgEnum("game_session_status", [
  "ACTIVE",
  "CANCEL",
  "END",
]);
export const boosterTypeEnum = pgEnum("booster_type", ["NORMAL", "RARE"]);
export const boosterActionEnum = pgEnum("booster_action", ["USE", "GAIN"]);
export const boosterUniqueEnum = pgEnum("booster_unique", [
  "UNIQUE",
  "NONUNIQUE",
]);
export const playerBoosterStatusEnum = pgEnum("player_booster_status", [
  "ACTIVE",
  "USED",
]);

export const difficultiesTable = pgTable("difficulties_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  inhale_second: real("inhale_second").notNull(),
});

export const charactersTable = pgTable("characters_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  achievement_number_required: integer("achievement_number_required").notNull(),
  detail: text("detail"),
});

export const playersTable = pgTable("players_table", {
  id: serial("id").primaryKey(),
  firebase_id: text("firebase_id").notNull().unique(),
  phone_number: text("phone_number").notNull().unique(),
  difficulty_id: integer("difficulty_id")
    .notNull()
    .references(() => difficultiesTable.id, { onDelete: "cascade" }),
  selected_character_id: integer("selected_character_id")
    .notNull()
    .references(() => charactersTable.id, { onDelete: "cascade" }),
  username: text("username"),
  gender: genderEnum("gender"),
  birth_year: integer("birth_year"),
  airflow: integer("airflow"),
  last_played_at: timestamp("last_played_at"),
  total_score: integer("total_score").notNull().default(0),
});

export const vasTable = pgTable("vas_table", {
  id: serial("id").primaryKey(),
  player_id: integer("player_id")
    .notNull()
    .references(() => playersTable.id, { onDelete: "cascade" }),
  vas_score: integer("vas_score").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const levelsTable = pgTable("levels_table", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull().unique(),
  score_required: integer("score_required").notNull(),
  boss_id: integer("boss_id").references(() => bossesTable.id, {
    onDelete: "no action",
  }),
  booster_id_1: integer("booster_id_1").references(() => boostersTable.id, {
    onDelete: "no action",
  }),
  booster_id_2: integer("booster_id_2").references(() => boostersTable.id, {
    onDelete: "no action",
  }),
  booster_id_3: integer("booster_id_3").references(() => boostersTable.id, {
    onDelete: "no action",
  }),
  booster_amount_1: integer("booster_amount_1").default(0),
  booster_amount_2: integer("booster_amount_2").default(0),
  booster_amount_3: integer("booster_amount_3").default(0),
});

export const gameSessionsTable = pgTable("game_sessions_table", {
  id: serial("id").primaryKey(),
  player_id: integer("player_id")
    .notNull()
    .references(() => playersTable.id, { onDelete: "no action" }),

  difficulty_id: integer("difficulty_id")
    .notNull()
    .references(() => difficultiesTable.id, { onDelete: "no action" }),

  boss_id: integer("boss_id")
    .notNull()
    .references(() => bossesTable.id, { onDelete: "no action" }),

  booster_drop_id: integer("booster_drop_id")
    .notNull()
    .references(() => boostersTable.id, { onDelete: "no action" }),

  booster_drop_duration: integer("booster_drop_duration"),
  score: integer("score"),
  lap: integer("lap"),
  started_at: timestamp("started_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at"),
  ended_at: timestamp("ended_at"),
  status: gameSessionStatusEnum("status"),
});

export const achievementsTable = pgTable("achievements_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  games_played_in_a_day: integer("games_played_in_a_day"),
  games_played_consecutive_days: integer("games_played_consecutive_days"),
  accumulative_score: integer("accumulative_score"),
  games_played: integer("games_played"),
  boosters_number: integer("boosters_number"), // TODO Booster Amount?
  booster_type: boosterTypeEnum("booster_type"),

  // TODO better name?
  booster_action: boosterActionEnum("booster_action"),
  booster_unique: boosterUniqueEnum("booster_unique"),

  boss_id: integer("boss_id").references(() => bossesTable.id, {
    onDelete: "no action",
  }),

  boss_encounter: integer("boss_encounter"),
  characters_unlocked: integer("characters_unlocked"),
  detail: text("detail"),
});

export const boostersTable = pgTable("boosters_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: boosterTypeEnum("type").notNull(),
  detail: text("detail"),
});

export const playersCharactersTable = pgTable("players_characters_table", {
  id: serial("id").primaryKey(),
  player_id: integer("player_id")
    .notNull()
    .references(() => playersTable.id, { onDelete: "cascade" }),
  character_id: integer("character_id")
    .notNull()
    .references(() => charactersTable.id, { onDelete: "cascade" }),
});

export const playersAchievementsTable = pgTable("players_achievements_table", {
  id: serial("id").primaryKey(),
  player_id: integer("player_id")
    .notNull()
    .references(() => playersTable.id, { onDelete: "cascade" }),
  achievement_id: integer("achievement_id")
    .notNull()
    .references(() => achievementsTable.id, { onDelete: "cascade" }),
});

export const playersBoostersTable = pgTable("players_boosters_table", {
  id: serial("id").primaryKey(),
  player_id: integer("player_id")
    .notNull()
    .references(() => playersTable.id, { onDelete: "cascade" }),
  booster_id: integer("booster_id")
    .notNull()
    .references(() => boostersTable.id, { onDelete: "cascade" }),
  expired_at: timestamp("expired_at"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  status: playerBoosterStatusEnum("status").notNull(),
});

export const bossesTable = pgTable("bosses_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  detail: text("detail"),
});

/*export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;*/
