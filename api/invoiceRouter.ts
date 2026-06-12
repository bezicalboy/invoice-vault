import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findInvoicesByUser,
  findInvoiceWithItems,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceItems,
} from "./queries/invoices";

export const invoiceRouter = createRouter({
  list: authedQuery
    .input(
      z
        .object({
          status: z.string().optional(),
          search: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return findInvoicesByUser(ctx.user.id, input || {});
    }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return findInvoiceWithItems(input.id, ctx.user.id);
    }),

  create: authedQuery
    .input(
      z.object({
        clientId: z.number(),
        issueDate: z.string(),
        dueDate: z.string(),
        items: z.array(
          z.object({
            description: z.string().min(1),
            quantity: z.number().min(0.01),
            unitPrice: z.number().min(0),
          })
        ),
        taxRate: z.number().default(0),
        notes: z.string().optional(),
        currency: z.string().default("USD"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { clientId, issueDate, dueDate, items, taxRate, notes, currency } =
        input;

      // Calculate totals
      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      const taxAmount = subtotal * (taxRate / 100);
      const total = subtotal + taxAmount;

      // Generate invoice number
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      const invoiceNumber = `INV-${timestamp}-${random}`;

      const invoiceItems = items.map((item) => ({
        description: item.description,
        quantity: item.quantity.toFixed(2),
        unitPrice: item.unitPrice.toFixed(2),
        amount: (item.quantity * item.unitPrice).toFixed(2),
      }));

      const result = await createInvoice({
        invoice: {
          userId: ctx.user.id,
          clientId,
          invoiceNumber,
          issueDate: new Date(issueDate),
          dueDate: new Date(dueDate),
          status: "draft",
          subtotal: subtotal.toFixed(2),
          taxRate: taxRate.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          total: total.toFixed(2),
          notes: notes || null,
          currency,
        },
        items: invoiceItems,
      });

      return result;
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        clientId: z.number().optional(),
        status: z
          .enum(["draft", "sent", "paid", "overdue", "cancelled"])
          .optional(),
        issueDate: z.string().optional(),
        dueDate: z.string().optional(),
        items: z
          .array(
            z.object({
              description: z.string().min(1),
              quantity: z.number().min(0.01),
              unitPrice: z.number().min(0),
            })
          )
          .optional(),
        taxRate: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, items, taxRate, issueDate, dueDate, ...invoiceData } = input;

      const updateData: Record<string, unknown> = { ...invoiceData };
      if (issueDate) updateData.issueDate = new Date(issueDate);
      if (dueDate) updateData.dueDate = new Date(dueDate);

      if (items && items.length > 0 && taxRate !== undefined) {
        // Recalculate totals
        const subtotal = items.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0
        );
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;

        await updateInvoice(id, ctx.user.id, {
          ...updateData,
          subtotal: subtotal.toFixed(2),
          taxRate: taxRate.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          total: total.toFixed(2),
        });

        const invoiceItems = items.map((item) => ({
          description: item.description,
          quantity: item.quantity.toFixed(2),
          unitPrice: item.unitPrice.toFixed(2),
          amount: (item.quantity * item.unitPrice).toFixed(2),
        }));

        await updateInvoiceItems(id, invoiceItems);
      } else {
        await updateInvoice(id, ctx.user.id, updateData);
      }

      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteInvoice(input.id, ctx.user.id);
      return { success: true };
    }),

  updateStatus: authedQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateInvoice(input.id, ctx.user.id, { status: input.status });
      return { success: true };
    }),
});
