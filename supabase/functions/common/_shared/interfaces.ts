export interface achievementInterface {
  id: number;
  games_played_in_a_day?: number | null;
  games_played_consecutive_days?: number | null;
  accumulative_score?: number | null;
  games_played?: number | null;
  boosters_number?: number | null;
  booster_type?: string | null;
  booster_action?: string | null;
  booster_unique?: string | null;
  boss_id?: number | null;
  boss_encounter?: number | null;
  characters_unlocked?: number | null;
}

export interface gameSessionInterface {
  id: number;
  player_id: number;
  difficulty_id: number;
  boss_id: number;
  booster_drop_id: number;
  booster_drop_duration: number | null;
  score: number | null;
  lap: number | null;
  started_at: Date;
  updated_at: Date | null;
  ended_at: Date | null;
  status: string | null;
}

export interface playersCharactersInterface {
  id: number;
  player_id: number;
  character_id: number;
}

export interface playersBoostersInterface {
  id: number;
  player_id: number;
  booster_id: number;
  expired_at: Date | null;
  created_at: Date;
  status: string;
  type: string;
}
