import type { MatchStatus, Prisma } from "@prisma/client";

import { prisma } from "../../shared/database/prisma.js";

type MatchFilters = {
  status?: MatchStatus;
  gameSlug?: string;
};

const matchInclude = {
  game: true,
  league: true,
  serie: true,
  tournament: true,
  teamA: true,
  teamB: true,
  winnerTeam: true,
  gameDetails: {
    orderBy: { order: "asc" }
  },
  streams: {
    orderBy: [{ isMain: "desc" }, { isOfficial: "desc" }, { language: "asc" }]
  }
} as const satisfies Prisma.MatchInclude;

export type PersistedMatch = Prisma.MatchGetPayload<{
  include: typeof matchInclude;
}>;

export class MatchesRepository {
  findMany(filters: MatchFilters = {}) {
    return prisma.match.findMany({
      where: {
        status: filters.status,
        game: filters.gameSlug ? { slug: filters.gameSlug } : undefined
      },
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 50
    });
  }

  findLive() {
    return this.findMany({ status: "LIVE" });
  }
}
