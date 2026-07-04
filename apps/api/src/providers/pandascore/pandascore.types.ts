export type PandaScoreTeam = {
  id: number;
  name: string;
  acronym: string | null;
  slug: string;
  location: string | null;
  image_url: string | null;
};

export type PandaScoreOpponent = {
  type: string;
  opponent: PandaScoreTeam | null;
};

export type PandaScoreStream = {
  main: boolean;
  official: boolean;
  language: string | null;
  raw_url: string;
  embed_url: string | null;
};

export type PandaScoreMatchGame = {
  id: number;
  position: number;
  status: string;
  winner?: {
    id: number | null;
    type: string;
  };
};

export type PandaScoreMatch = {
  id: number;
  name: string;
  status: string;
  match_type: string;
  number_of_games: number;
  begin_at: string | null;
  scheduled_at: string | null;
  original_scheduled_at: string | null;
  end_at: string | null;
  league?: {
    id: number;
    name: string;
    slug: string;
  };
  serie?: {
    id: number;
    full_name: string;
    season: string | null;
    year: number;
  };
  tournament?: {
    id: number;
    name: string;
    slug: string;
  };
  opponents: PandaScoreOpponent[];
  results: Array<{
    team_id: number;
    score: number;
  }>;
  games: PandaScoreMatchGame[];
  streams_list: PandaScoreStream[];
  live: {
    supported: boolean;
    url: string | null;
    opens_at: string | null;
  };
};
