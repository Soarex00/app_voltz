import { PandaScoreClient } from "./pandascore.client.js";
import { mapPandaScoreMatchForApp } from "./pandascore.mapper.js";
import type { PandaScoreMatch } from "./pandascore.types.js";

type TodayMatchesInput = {
  startUtc: string;
  endUtc: string;
};

export class PandaScoreProvider {
  constructor(private readonly client = new PandaScoreClient()) {}

  async getLolMatchesByDate({ startUtc, endUtc }: TodayMatchesInput) {
    const matchesById = new Map<number, PandaScoreMatch>();

    for (const field of ["begin_at", "scheduled_at"]) {
      const params = new URLSearchParams({
        per_page: "100",
        sort: field
      });
      params.set(`range[${field}]`, `${startUtc},${endUtc}`);

      const matches = await this.client.get<PandaScoreMatch[]>("/lol/matches", params);

      for (const match of matches) {
        matchesById.set(match.id, match);
      }
    }

    return [...matchesById.values()]
      .sort((left, right) => {
        const leftDate = left.begin_at ?? left.scheduled_at ?? "";
        const rightDate = right.begin_at ?? right.scheduled_at ?? "";
        return leftDate.localeCompare(rightDate);
      })
      .map(mapPandaScoreMatchForApp);
  }
}
