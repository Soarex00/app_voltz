import { z } from "zod";

import { MatchesRepository } from "./matches.repository.js";

const statusMap = {
  scheduled: "SCHEDULED",
  live: "LIVE",
  finished: "FINISHED",
  postponed: "POSTPONED",
  canceled: "CANCELED"
} as const;

const filtersSchema = z.object({
  status: z.enum(["scheduled", "live", "finished", "postponed", "canceled"]).optional(),
  gameSlug: z.string().min(1).optional()
});

export class MatchesService {
  constructor(private readonly matchesRepository = new MatchesRepository()) {}

  listMatches(rawFilters: unknown) {
    const filters = filtersSchema.parse(rawFilters);

    return this.matchesRepository.findMany({
      status: filters.status ? statusMap[filters.status] : undefined,
      gameSlug: filters.gameSlug
    });
  }

  listLiveMatches() {
    return this.matchesRepository.findLive();
  }
}
