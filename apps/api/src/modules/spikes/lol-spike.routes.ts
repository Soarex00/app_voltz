import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { PandaScoreProvider } from "../../providers/pandascore/pandascore.provider.js";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export async function lolSpikeRoutes(app: FastifyInstance) {
  const pandaScoreProvider = new PandaScoreProvider();

  app.get("/matches/today", async (request) => {
    const { date = getTodayInSaoPaulo() } = querySchema.parse(request.query);
    const { startUtc, endUtc } = getSaoPauloUtcRange(date);
    const matches = await pandaScoreProvider.getLolMatchesByDate({
      startUtc,
      endUtc
    });

    return {
      data: matches,
      meta: {
        source: "pandascore",
        game: "league-of-legends",
        date,
        timezone: "America/Sao_Paulo"
      }
    };
  });
}

function getTodayInSaoPaulo() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function getSaoPauloUtcRange(date: string) {
  const start = new Date(`${date}T03:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  end.setUTCMilliseconds(end.getUTCMilliseconds() - 1);

  return {
    startUtc: start.toISOString(),
    endUtc: end.toISOString()
  };
}
