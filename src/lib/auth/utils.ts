import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { redirect } from "next/navigation";

export const getCurrentUser = cache(async () => {
  const sessionToken = (await cookies()).get("session")?.value;
  if (!sessionToken) return null;

  const session = await prisma.session.findFirst({
    where: {
      sessionToken,
      isActive: true,
      OR: [{ expires: null }, { expires: { gt: new Date() } }],
    },
    include: {
      user: true,
    },
  });

  if (!session?.user || !session.user.isActive) {
    return null;
  }

  return session.user;
});

export type Role = "ADMIN" | "EDITOR" | "INSTRUCTOR" | "USER";

export function hasRole(user: { role?: Role }, roles: Role[]) {
  return !!user.role && roles.includes(user.role);
}

export async function isAdmin() {
  const user = await getCurrentUser();

  return user?.role?.toUpperCase() === "ADMIN";
}

export function canAccess(user: { role?: Role }, allowed: Role[]) {
  return allowed.includes(user.role as Role);
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login"); // or /403
  }

  return user;
}

export async function getSession(): Promise<Session> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authenticated: false,
      user: null,
    };
  }

  return {
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName ?? "",
    },
  };
}
