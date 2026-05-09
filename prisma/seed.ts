import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { teams } from "./seed-data/teams";
import { groups } from "./seed-data/groups";
import { matches } from "./seed-data/matches";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seedTeams() {
  for (const t of teams) {
    await prisma.team.upsert({
      where: { code: t.code },
      update: { name: t.name, flagUrl: t.flagUrl, fifaRanking: t.fifaRanking },
      create: { name: t.name, code: t.code, flagUrl: t.flagUrl, fifaRanking: t.fifaRanking },
    });
  }
  console.log(`✓ Seeded ${teams.length} teams`);
}

async function seedGroups() {
  for (const g of groups) {
    const group = await prisma.group.upsert({
      where: { name: g.name },
      update: {},
      create: { name: g.name },
    });

    for (const { code, pot } of g.teams) {
      const team = await prisma.team.findUniqueOrThrow({ where: { code } });
      await prisma.groupTeam.upsert({
        where: { groupId_teamId: { groupId: group.id, teamId: team.id } },
        update: { pot },
        create: { groupId: group.id, teamId: team.id, pot },
      });
    }
  }
  console.log(`✓ Seeded ${groups.length} groups`);
}

async function seedMatches() {
  for (const m of matches) {
    const groupId = m.groupName
      ? (await prisma.group.findUniqueOrThrow({ where: { name: m.groupName } })).id
      : null;
    const homeTeamId = m.homeTeamCode
      ? (await prisma.team.findUniqueOrThrow({ where: { code: m.homeTeamCode } })).id
      : null;
    const awayTeamId = m.awayTeamCode
      ? (await prisma.team.findUniqueOrThrow({ where: { code: m.awayTeamCode } })).id
      : null;

    const data = {
      phase: m.phase,
      groupId,
      homeTeamId,
      awayTeamId,
      homeSlot: m.homeSlot ?? null,
      awaySlot: m.awaySlot ?? null,
      kickoffAt: new Date(m.kickoffAt),
      stadium: m.stadium,
      city: m.city,
      referee: m.referee ?? null,
    };

    await prisma.match.upsert({
      where: { matchNumber: m.matchNumber },
      update: data,
      create: { matchNumber: m.matchNumber, ...data },
    });
  }
  console.log(`✓ Seeded ${matches.length} matches`);
}

async function main() {
  await seedTeams();
  await seedGroups();
  await seedMatches();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
