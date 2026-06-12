import * as jose from "jose";
import { env } from "../lib/env";

const JWT_ALG = "HS256";

export type SessionPayload = {
  userId: number;
};

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
    });
    const rawUserId = payload.userId;
    const userId =
      typeof rawUserId === "string"
        ? parseInt(rawUserId, 10)
        : typeof rawUserId === "number"
          ? rawUserId
          : NaN;
    if (!Number.isInteger(userId) || userId <= 0) {
      return null;
    }
    return { userId };
  } catch {
    return null;
  }
}
