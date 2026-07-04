import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const games = [
  {
    name: "League of Legends",
    slug: "league-of-legends"
  },
  {
    name: "Counter-Strike 2",
    slug: "counter-strike-2"
  },
  {
    name: "Valorant",
    slug: "valorant"
  }
];

async function main() {
  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        name: game.name,
        isActive: true
      },
      create: {
        ...game,
        isActive: true
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
