import type { InvoiceStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function findInvoicesByUser(
  userId: number,
  filters?: { status?: string; search?: string; page?: number; limit?: number },
) {
  const { status, search, page = 1, limit = 20 } = filters || {};

  const where: Prisma.InvoiceWhereInput = { userId };

  if (status) {
    where.status = status as InvoiceStatus;
  }

  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  return { invoices, total };
}

export async function findInvoiceById(id: number, userId: number) {
  return prisma.invoice.findFirst({
    where: { id, userId },
  });
}

export async function findInvoiceWithItems(id: number, userId: number) {
  const invoice = await findInvoiceById(id, userId);
  if (!invoice) return null;

  const [items, client] = await Promise.all([
    prisma.invoiceItem.findMany({
      where: { invoiceId: id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.client.findUnique({ where: { id: invoice.clientId } }),
  ]);

  return { ...invoice, items, client };
}

export async function createInvoice(data: {
  invoice: Prisma.InvoiceUncheckedCreateInput;
  items: Omit<Prisma.InvoiceItemUncheckedCreateInput, "invoiceId">[];
}) {
  const invoice = await prisma.invoice.create({
    data: {
      ...data.invoice,
      items: {
        create: data.items.map((item, index) => ({
          ...item,
          sortOrder: index,
        })),
      },
    },
  });

  return { id: invoice.id, invoiceNumber: invoice.invoiceNumber };
}

export async function updateInvoice(
  id: number,
  userId: number,
  data: Prisma.InvoiceUpdateInput,
) {
  await prisma.invoice.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteInvoice(id: number, userId: number) {
  await prisma.invoice.deleteMany({ where: { id, userId } });
}

export async function updateInvoiceItems(
  invoiceId: number,
  items: Omit<Prisma.InvoiceItemUncheckedCreateInput, "invoiceId">[],
) {
  await prisma.$transaction([
    prisma.invoiceItem.deleteMany({ where: { invoiceId } }),
    ...(items.length > 0
      ? [
          prisma.invoiceItem.createMany({
            data: items.map((item, index) => ({
              ...item,
              invoiceId,
              sortOrder: index,
            })),
          }),
        ]
      : []),
  ]);
}
