import type { PersistedMatch } from "./matches.repository.js";

const statusMap = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
  POSTPONED: "postponed",
  CANCELED: "canceled"
} as const;

const tournamentStatusMap = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  FINISHED: "finished",
  CANCELED: "canceled"
} as const;

export function presentMatch(match: PersistedMatch) {
  return {
    id: match.id,
    externalId: match.externalId,
    provider: match.provider,
    name: match.name,
    game: {
      id: match.game.id,
      name: match.game.name,
      slug: match.game.slug,
      imageUrl: match.game.imageUrl
    },
    league: match.league
      ? {
          id: match.league.id,
          name: match.league.name,
          slug: match.league.slug,
          region: match.league.region,
          imageUrl: match.league.imageUrl
        }
      : null,
    serie: match.serie
      ? {
          id: match.serie.id,
          name: match.serie.name,
          fullName: match.serie.fullName,
          slug: match.serie.slug,
          season: match.serie.season,
          year: match.serie.year
        }
      : null,
    status: statusMap[match.status],
    startTime: match.startTime,
    scheduledAt: match.scheduledAt,
    originalScheduledAt: match.originalScheduledAt,
    matchType: match.matchType,
    numberOfGames: match.numberOfGames,
    scoreA: match.scoreA,
    scoreB: match.scoreB,
    tournament: match.tournament
      ? {
          id: match.tournament.id,
          externalId: match.tournament.externalId,
          provider: match.tournament.provider,
          name: match.tournament.name,
          slug: match.tournament.slug,
          region: match.tournament.region,
          season: match.tournament.season,
          tier: match.tournament.tier,
          country: match.tournament.country,
          startDate: match.tournament.startDate,
          endDate: match.tournament.endDate,
          status: tournamentStatusMap[match.tournament.status]
        }
      : null,
    teamA: presentTeam(match.teamA),
    teamB: presentTeam(match.teamB),
    winnerTeam: presentTeam(match.winnerTeam),
    games: match.gameDetails.map((game) => ({
      id: game.id,
      order: game.order,
      mapName: game.mapName,
      status: statusMap[game.status],
      scoreA: game.scoreA,
      scoreB: game.scoreB,
      winnerTeamId: game.winnerTeamId,
      startedAt: game.startedAt,
      finishedAt: game.finishedAt
    })),
    streams: match.streams.map((stream) => ({
      id: stream.id,
      language: stream.language,
      isMain: stream.isMain,
      isOfficial: stream.isOfficial,
      rawUrl: stream.rawUrl,
      embedUrl: stream.embedUrl
    }))
  };
}

function presentTeam(team: PersistedMatch["teamA"] | PersistedMatch["teamB"] | PersistedMatch["winnerTeam"]) {
  if (!team) {
    return null;
  }

  return {
    id: team.id,
    externalId: team.externalId,
    provider: team.provider,
    name: team.name,
    acronym: team.acronym,
    slug: team.slug,
    logoUrl: team.logoUrl,
    region: team.region,
    country: team.country
  };
}
