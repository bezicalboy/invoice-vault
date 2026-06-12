import { prisma } from "../lib/prisma";

function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function getDashboardStats(userId: number) {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);

  const [
    totalInvoices,
    paidAgg,
    sentAgg,
    overdueAgg,
    recentInvoices,
    paidInvoicesForChart,
  ] = await Promise.all([
    prisma.invoice.count({ where: { userId } }),
    prisma.invoice.aggregate({
      where: { userId, status: "paid" },
      _sum: { total: true },
    }),
    prisma.invoice.aggregate({
      where: { userId, status: "sent" },
      _sum: { total: true },
    }),
    prisma.invoice.aggregate({
      where: { userId, status: "overdue" },
      _sum: { total: true },
    }),
    prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.invoice.findMany({
      where: {
        userId,
        status: "paid",
        createdAt: { gte: twelveMonthsAgo },
      },
      select: { total: true, createdAt: true },
    }),
  ]);

  const monthlyTotals = new Map<string, number>();
  for (const invoice of paidInvoicesForChart) {
    const month = formatMonth(invoice.createdAt);
    const amount = Number(invoice.total);
    monthlyTotals.set(month, (monthlyTotals.get(month) ?? 0) + amount);
  }

  const monthlyRevenue = Array.from(monthlyTotals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }));

  return {
    totalInvoices,
    totalRevenue: Number(paidAgg._sum.total ?? 0),
    outstandingAmount: Number(sentAgg._sum.total ?? 0),
    overdueAmount: Number(overdueAgg._sum.total ?? 0),
    recentInvoices,
    monthlyRevenue,
  };
}
