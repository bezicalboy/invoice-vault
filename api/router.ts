import { authRouter } from "./auth-router";
import { clientsRouter } from "./clientRouter";
import { invoiceRouter } from "./invoiceRouter";
import { dashboardRouter } from "./dashboardRouter";
import { companyProfileRouter } from "./companyProfileRouter";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  clients: clientsRouter,
  invoice: invoiceRouter,
  dashboard: dashboardRouter,
  companyProfile: companyProfileRouter,
});

export type AppRouter = typeof appRouter;
