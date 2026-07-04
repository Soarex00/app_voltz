import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { GamesService } from "./games.service.js";

const paramsSchema = z.object({
  slug: z.string().min(1)
});

export async function gamesRoutes(app: FastifyInstance) {
  const gamesService = new GamesService();

  app.get("/", async () => {
    const games = await gamesService.listActiveGames();

    return { data: games };
  });

  app.get("/:slug", async (request) => {
    const { slug } = paramsSchema.parse(request.params);
    const game = await gamesService.getGameBySlug(slug);

    return { data: game };
  });
}
