import { env } from "./shared/config/env.js";
import { prisma } from "./shared/database/prisma.js";
import { buildApp } from "./app.js";

const app = await buildApp();

const shutdown = async () => {
  app.log.info("Shutting down API");
  await app.close();
  await prisma.$disconnect();
};

process.on("SIGINT", () => {
  void shutdown().then(() => process.exit(0));
});

process.on("SIGTERM", () => {
  void shutdown().then(() => process.exit(0));
});

try {
  await app.listen({ host: env.API_HOST, port: env.API_PORT });
} catch (error) {
  app.log.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
