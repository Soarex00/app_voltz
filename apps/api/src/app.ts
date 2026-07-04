import cors from "@fastify/cors";
import Fastify from "fastify";

import { env } from "./shared/config/env.js";
import { registerErrorHandler } from "./shared/http/error-handler.js";
import { gamesRoutes } from "./modules/games/games.routes.js";
import { matchesRoutes } from "./modules/matches/matches.routes.js";
import { lolSpikeRoutes } from "./modules/spikes/lol-spike.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === "test" ? false : true,
    requestIdHeader: "x-request-id"
  });

  await app.register(cors, {
    origin: env.APP_ORIGIN === "*" ? true : env.APP_ORIGIN
  });

  registerErrorHandler(app);

  app.get("/health", async () => ({
    status: "ok",
    service: "app-voltz-api"
  }));

  await app.register(gamesRoutes, { prefix: "/games" });
  await app.register(matchesRoutes, { prefix: "/matches" });
  await app.register(lolSpikeRoutes, { prefix: "/spikes/lol" });

  return app;
}
