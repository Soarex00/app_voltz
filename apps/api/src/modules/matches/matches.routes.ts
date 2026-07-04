import type { FastifyInstance } from "fastify";

import { presentMatch } from "./matches.presenter.js";
import { MatchesService } from "./matches.service.js";

export async function matchesRoutes(app: FastifyInstance) {
  const matchesService = new MatchesService();

  app.get("/", async (request) => {
    const matches = await matchesService.listMatches(request.query);

    return { data: matches.map(presentMatch) };
  });

  app.get("/live", async () => {
    const matches = await matchesService.listLiveMatches();

    return { data: matches.map(presentMatch) };
  });
}
