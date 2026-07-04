import type { PandaScoreMatch } from "./pandascore.types.js";

const statusMap: Record<string, string> = {
  not_started: "scheduled",
  running: "live",
  finished: "finished",
  canceled: "canceled",
  postponed: "postponed"
};

export function mapPandaScoreMatchForApp(match: PandaScoreMatch) {
  return {
    externalId: String(match.id),
    name: match.name,
    status: statusMap[match.status] ?? match.status,
    providerStatus: match.status,
    matchType: match.match_type,
    numberOfGames: match.number_of_games,
    beginAt: match.begin_at,
    scheduledAt: match.scheduled_at,
    originalScheduledAt: match.original_scheduled_at,
    endAt: match.end_at,
    league: match.league
      ? {
          externalId: String(match.league.id),
          name: match.league.name,
          slug: match.league.slug
        }
      : null,
    serie: match.serie
      ? {
          externalId: String(match.serie.id),
          fullName: match.serie.full_name,
          season: match.serie.season,
          year: match.serie.year
        }
      : null,
    tournament: match.tournament
      ? {
          externalId: String(match.tournament.id),
          name: match.tournament.name,
          slug: match.tournament.slug
        }
      : null,
    opponents: match.opponents.map((entry) => ({
      type: entry.type,
      externalId: entry.opponent ? String(entry.opponent.id) : null,
      name: entry.opponent?.name ?? "TBD",
      acronym: entry.opponent?.acronym ?? null,
      imageUrl: entry.opponent?.image_url ?? null,
      country: entry.opponent?.location ?? null
    })),
    results: match.results.map((result) => ({
      teamExternalId: String(result.team_id),
      score: result.score
    })),
    games: match.games.map((game) => ({
      externalId: String(game.id),
      order: game.position,
      status: statusMap[game.status] ?? game.status,
      providerStatus: game.status,
      winnerExternalId: game.winner?.id ? String(game.winner.id) : null
    })),
    streams: match.streams_list.map((stream) => ({
      language: stream.language,
      isMain: stream.main,
      isOfficial: stream.official,
      rawUrl: stream.raw_url,
      embedUrl: stream.embed_url
    })),
    live: {
      supported: match.live.supported,
      url: match.live.url,
      opensAt: match.live.opens_at
    }
  };
}
