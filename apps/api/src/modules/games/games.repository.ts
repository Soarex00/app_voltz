import { prisma } from "../../shared/database/prisma.js";

export class GamesRepository {
  findManyActive() {
    return prisma.game.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });
  }

  findBySlug(slug: string) {
    return prisma.game.findUnique({
      where: { slug }
    });
  }
}
