"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "./password";
import { createSession } from "./session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { fail, failData, success } from "../actions/actionResponse";
import { loginSchema, registerSchema } from "../schemas/auth";

export async function registerAction(_: unknown, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    const name =
      typeof data?.name === "string"
        ? data?.name.split(" ")
        : [String(data?.name), ""];

    const parsed = registerSchema.safeParse({
      ...data,
      firstName: name[0],
      lastName: name[1],
    });

    if (!parsed.success) {
      return failData(400, null, "Invalid or Missing Credentials");
    }

    const { email, password, firstName, lastName, dateOfBirth } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return failData(409, null, "Email already in use");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        firstName,
        lastName,
        dateOfBirth,
      },
    });

    await createSession(user.id);

    // redirect("/"); // or /learn, /home, etc.

    return success(null, "success");
  } catch {
    return failData(500, null, "Server Error");
  }
}

export async function loginAction(_: unknown, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      return failData(400, null, "Invalid or Missing Credentials");
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return failData(403, null, "User not found");
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return failData(400, null, "Invalid or Missing Credentials");
    }

    await createSession(user.id);

    // redirect("/");
    return success(null, "success");
  } catch {
    return failData(500, null, "Server Error");
  }
}

export async function logoutAction() {
  const sessionToken = (await cookies()).get("session")?.value;

  if (sessionToken) {
    await prisma.session.updateMany({
      where: { sessionToken },
      data: { isActive: false },
    });

    (await cookies()).delete("session");
  }

  redirect("/");
}

export async function forgotPasswordAction(_: unknown, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    return success(data);
  } catch {
    return fail(500, "Server Error");
  }
}
