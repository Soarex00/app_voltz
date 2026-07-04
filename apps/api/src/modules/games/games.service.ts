import { NotFoundError } from "../../shared/errors/not-found-error.js";
import { GamesRepository } from "./games.repository.js";

export class GamesService {
  constructor(private readonly gamesRepository = new GamesRepository()) {}

  listActiveGames() {
    return this.gamesRepository.findManyActive();
  }

  async getGameBySlug(slug: string) {
    const game = await this.gamesRepository.findBySlug(slug);

    if (!game) {
      throw new NotFoundError("Game not found", { slug });
    }

    return game;
  }
}
