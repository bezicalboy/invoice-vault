import { createRouter, authedQuery } from "./middleware";
import { getDashboardStats } from "./queries/dashboard";

export const dashboardRouter = createRouter({
  stats: authedQuery.query(async ({ ctx }) => {
    return getDashboardStats(ctx.user.id);
  }),
});
