import { prisma } from "../lib/prisma";
import { env } from "../lib/env";
import { toSafeUser } from "../types";

export async function findUserById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toSafeUser(user) : null;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name?: string;
}) {
  const email = data.email.toLowerCase();
  const role =
    env.ownerEmail && email === env.ownerEmail.toLowerCase() ? "admin" : "user";

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: data.passwordHash,
      name: data.name,
      role,
      lastSignInAt: new Date(),
    },
  });

  return toSafeUser(user);
}

export async function updateLastSignIn(id: number) {
  const user = await prisma.user.update({
    where: { id },
    data: { lastSignInAt: new Date() },
  });
  return toSafeUser(user);
}
