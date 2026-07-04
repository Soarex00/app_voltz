import { env } from "../../shared/config/env.js";
import { AppError } from "../../shared/errors/app-error.js";

type PandaScoreClientOptions = {
  baseUrl?: string;
  token?: string;
};

export class PandaScoreClient {
  private readonly baseUrl: string;
  private readonly token?: string;

  constructor(options: PandaScoreClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? "https://api.pandascore.co";
    this.token = options.token ?? env.PANDASCORE_API_TOKEN;
  }

  async get<T>(path: string, searchParams: URLSearchParams = new URLSearchParams()) {
    if (!this.token) {
      throw new AppError({
        code: "PANDASCORE_TOKEN_MISSING",
        message: "PandaScore token is not configured",
        statusCode: 500
      });
    }

    const url = new URL(path, this.baseUrl);
    searchParams.forEach((value, key) => url.searchParams.set(key, value));

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`
      }
    });

    const body = await response.text();

    if (!response.ok) {
      throw new AppError({
        code: "PANDASCORE_REQUEST_FAILED",
        message: "PandaScore request failed",
        statusCode: response.status >= 500 ? 502 : response.status,
        details: {
          status: response.status,
          body: body.slice(0, 500)
        }
      });
    }

    return JSON.parse(body) as T;
  }
}
