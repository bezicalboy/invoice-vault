import { prisma } from "../api/lib/prisma";

async function seed() {
  console.log("Seeding database...");
  // Add seed data here if needed.
  console.log("Done.");
  await prisma.$disconnect();
  process.exit(0);
}

seed();
