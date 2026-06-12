import { prisma } from "../lib/prisma";

export async function findCompanyProfileByUser(userId: number) {
  return prisma.companyProfile.findUnique({ where: { userId } });
}

export async function upsertCompanyProfile(
  userId: number,
  data: {
    companyName?: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxId?: string;
    currency?: string;
    accentColor?: string;
  },
) {
  return prisma.companyProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}
