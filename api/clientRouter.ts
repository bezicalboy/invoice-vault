import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findClientsByUser,
  searchClients,
  findClientById,
  createClient,
  updateClient,
  deleteClient,
} from "./queries/clients";

export const clientsRouter = createRouter({
  list: authedQuery
    .input(
      z.object({ search: z.string().optional() }).optional()
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      if (input?.search) {
        return searchClients(userId, input.search);
      }
      return findClientsByUser(userId);
    }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return findClientById(input.id, ctx.user.id);
    }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().optional(),
        company: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        currency: z.string().default("USD"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await createClient({
        ...input,
        userId: ctx.user.id,
      });
      return { id };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().optional(),
        company: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updateClient(id, ctx.user.id, data);
      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteClient(input.id, ctx.user.id);
      return { success: true };
    }),
});
