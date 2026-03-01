"use server";

import { getCurrentUser } from "@/lib/auth/utils";
import { fail, failData, success } from "../actionResponse";
import { prisma } from "@/lib/prisma";
import { formDataToObject, normalizeDate } from "@/lib/helpers";
import { NoteSchema } from "@/lib/schemas/note";
import { Prisma } from "../../../../generated/prisma/client";
import { revalidatePath } from "next/cache";

type NotesFitlers = {
  query?: string;
  showDeleted?: boolean;
};

export async function getNotes({
  sort,
  filters,
}: {
  sort?: Sort;
  filters?: NotesFitlers;
}) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const whereClause: Prisma.NoteWhereInput = {
      userId: user.id,
      deletedAt: {},
    };

    // 🧠 Deleted logic
    if (filters?.showDeleted) {
      whereClause.deletedAt = {};
    } else {
      whereClause.deletedAt = null;
    }

    if (filters?.query?.trim()) {
      whereClause.OR = [
        { title: { contains: filters?.query, mode: "insensitive" } },
        { details: { contains: filters?.query, mode: "insensitive" } },
      ];
    }

    const orderByClause: Prisma.NoteOrderByWithRelationInput | undefined = sort
      ? { [sort.field]: sort.direction }
      : { updatedAt: "desc" };

    const [data, count] = await prisma.$transaction([
      prisma.note.findMany({
        where: whereClause,
        orderBy: orderByClause,
      }),
      prisma.note.count({
        where: whereClause,
      }),
    ]);

    return success(data, "", count);
  } catch (err) {
    console.log(err);
    return failData(500, [], "Server Error");
  }
}

export async function createNote() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return fail(403, "Un-Authorized");
    }

    const data = await prisma.note.create({
      data: {
        userId: user.id,
        title: "",
        details: "",
        openedAt: new Date(),
        pinnedAt: null,
        deletedAt: null,
      },
    });

    revalidatePath("/notes");

    return success(data, "Task updated");
  } catch {
    return fail(500, "Server error");
  }
}

export async function updateNote(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return fail(403, "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    const result = NoteSchema.safeParse({
      ...raw,
      openedAt: normalizeDate(raw.openedAt),
      pinnedAt: normalizeDate(raw.pinnedAt),
      deletedAt: normalizeDate(raw.deletedAt),
    });

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    const data = await prisma.note.update({
      where: { id: parsed.id },
      data: {
        title: parsed.title,
        details: parsed.details,
      },
    });

    return success(data, "Task updated");
  } catch {
    return fail(500, "Server error");
  }
}

export async function toggleOpenNote({
  id,
  openedAt,
}: {
  id: string;
  openedAt: Date | null;
}) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return fail(403, "Un-Authorized");
    }

    await prisma.note.update({
      where: { id },
      data: {
        openedAt: openedAt === null ? null : new Date(),
      },
    });

    revalidatePath("/notes");

    return success(null);
  } catch {
    return fail(500, "Server Error");
  }
}

export async function togglePinNote({
  id,
  pinnedAt,
}: {
  id: string;
  pinnedAt: Date | null;
}) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return fail(403, "Un-Authorized");
    }

    await prisma.note.update({
      where: { id },
      data: {
        pinnedAt,
      },
    });

    revalidatePath("/notes");

    return success(null);
  } catch {
    return fail(500, "Server Error");
  }
}

export async function deleteNote(id: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return fail(403, "Un-Authorized");
    }

    await prisma.note.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return success(null);
  } catch {
    return fail(500, "Server Error");
  }
}
