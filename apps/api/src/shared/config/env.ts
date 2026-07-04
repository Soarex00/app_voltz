import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import { z } from "zod";

// Monorepo: a API roda com cwd em apps/api, mas o .env fica na raiz.
// Carrega o primeiro .env encontrado subindo a partir deste arquivo.
loadRootEnv();

function loadRootEnv() {
  let current = dirname(fileURLToPath(import.meta.url));

  for (let depth = 0; depth < 6; depth += 1) {
    const candidate = resolve(current, ".env");
    if (existsSync(candidate)) {
      loadEnv({ path: candidate });
      return;
    }

    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  // Fallback: comportamento padrão baseado no cwd.
  loadEnv();
}

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(3333),
  API_HOST: z.string().default("0.0.0.0"),
  APP_ORIGIN: z.string().default("*"),
  PANDASCORE_API_TOKEN: z.string().optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables", parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
