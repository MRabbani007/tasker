import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";

const SESSION_DURATION_DAYS = 30;

export async function createSession(userId: string) {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

  const headerStore = await headers();

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires,
      ipAddress: headerStore.get("x-forwarded-for") ?? undefined,
      userAgent: headerStore.get("user-agent") ?? undefined,
    },
  });

  (await cookies()).set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}
