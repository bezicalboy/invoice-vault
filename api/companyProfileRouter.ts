import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findCompanyProfileByUser,
  upsertCompanyProfile,
} from "./queries/companyProfile";

export const companyProfileRouter = createRouter({
  get: authedQuery.query(async ({ ctx }) => {
    return findCompanyProfileByUser(ctx.user.id);
  }),

  upsert: authedQuery
    .input(
      z.object({
        companyName: z.string().optional(),
        logo: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        taxId: z.string().optional(),
        currency: z.string().optional(),
        accentColor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await upsertCompanyProfile(ctx.user.id, input);
      return { success: true };
    }),
});
