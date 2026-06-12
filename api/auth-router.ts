import * as cookie from "cookie";
import * as bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { signSessionToken } from "./auth/session";
import {
  createUser,
  findUserByEmail,
  updateLastSignIn,
} from "./queries/users";
const SALT_ROUNDS = 12;

function setSessionCookie(
  ctx: { req: Request; resHeaders: Headers },
  token: string,
) {
  const opts = getSessionCookieOptions(ctx.req.headers);
  ctx.resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: Session.maxAgeMs / 1000,
    }),
  );
}

const credentialsInput = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  register: publicQuery
    .input(
      credentialsInput.extend({
        name: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists.",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
      const user = await createUser({
        email: input.email,
        passwordHash,
        name: input.name,
      });

      const token = await signSessionToken({ userId: user.id });
      setSessionCookie(ctx, token);

      return user;
    }),

  login: publicQuery.input(credentialsInput).mutation(async ({ ctx, input }) => {
    const user = await findUserByEmail(input.email);
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password.",
      });
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password.",
      });
    }

    const safeUser = await updateLastSignIn(user.id);
    const token = await signSessionToken({ userId: safeUser.id });
    setSessionCookie(ctx, token);

    return safeUser;
  }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
