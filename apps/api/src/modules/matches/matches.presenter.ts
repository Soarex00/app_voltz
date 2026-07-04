import type { Match, Game, Team, Tournament } from "@prisma/client";

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

type MatchWithRelations = Match & {
  game: Game;
  tournament: Tournament | null;
  teamA: Team | null;
  teamB: Team | null;
  winnerTeam: Team | null;
};

export function presentMatch(match: MatchWithRelations) {
  return {
    ...match,
    status: statusMap[match.status],
    tournament: match.tournament
      ? {
          ...match.tournament,
          status: tournamentStatusMap[match.tournament.status]
        }
      : null
  };
}
