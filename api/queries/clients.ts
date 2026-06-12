import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function findClientsByUser(userId: number) {
  return prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function searchClients(userId: number, search: string) {
  return prisma.client.findMany({
    where: {
      userId,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function findClientById(id: number, userId: number) {
  return prisma.client.findFirst({
    where: { id, userId },
  });
}

export async function createClient(data: Prisma.ClientUncheckedCreateInput) {
  const client = await prisma.client.create({ data });
  return client.id;
}

export async function updateClient(
  id: number,
  userId: number,
  data: Prisma.ClientUpdateInput,
) {
  await prisma.client.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteClient(id: number, userId: number) {
  await prisma.client.deleteMany({ where: { id, userId } });
}
