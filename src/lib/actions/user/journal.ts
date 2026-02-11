"use server";

import { getCurrentUser } from "@/lib/auth/utils";
import { fail, failData, success } from "../actionResponse";
import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  formDataToObject,
  normalizeDate,
  normalizeNumber,
} from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { createJournalEntrySchema } from "@/lib/schemas/journal";

export async function getJournalEntries({
  itemsPerPage = 20,
  page = 1,
  filters,
  sort,
}: {
  itemsPerPage?: number;
  page?: number;
  sort?: Sort;
  filters?: JournalFilters;
}) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const skip = (page - 1) * itemsPerPage;
    const take = itemsPerPage;

    const whereClause: Prisma.JournalEntryWhereInput = { userId: user.id };

    if (filters?.query) {
      whereClause.OR = [
        { subject: { contains: filters.query, mode: "insensitive" } },
        { content: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    // Always apply day filter (defaults to today)
    // const { start, end } = getDayRange(filters?.day);

    // whereClause.occurredOn = {
    //   gte: start,
    //   lt: end,
    // };

    const orderByClause:
      | Prisma.JournalEntryOrderByWithRelationInput[]
      | undefined = sort
      ? [{ [sort.field]: sort.direction }, { createdAt: "desc" }]
      : [{ occurredOn: "desc" }, { createdAt: "desc" }];

    //       const orderByClause: Prisma.JournalEntryOrderByWithRelationInput[] = [
    //   { occurredOn: sort?.direction ?? "desc" },
    //   { createdAt: "desc" },
    // ];

    const [data, count] = await prisma.$transaction([
      prisma.journalEntry.findMany({
        where: whereClause,
        take,
        skip,
        orderBy: orderByClause,
      }),
      prisma.journalEntry.count({
        where: whereClause,
      }),
    ]);

    return success(data, "", count);
  } catch {
    return failData(500, [], "Server Error");
  }
}

export async function createJournalEntry(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    const result = createJournalEntrySchema.safeParse({
      ...raw,
      sortIndex: normalizeNumber(raw.sortIndex),
      occurredOn: normalizeDate(raw.occurredOn),
      occurredAt: normalizeDate(raw.occurredAt) ?? "",
    });

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    let occurredAt: Date | null = null;

    if (parsed.occurredOn) {
      const date = new Date(parsed.occurredOn);
      const time =
        parsed.occurredAt?.trim() === "" ? "23:59" : parsed.occurredAt;

      // Add functionality for moving tasks, zod schema, server action, form, button on task card, basic testing
      const [h, m] = time.split(":").map(Number);

      date.setHours(h, m, 0, 0);
      occurredAt = date;
    }

    const prismaData: Prisma.JournalEntryCreateInput = {
      type: parsed.type,
      subject: parsed.subject,
      content: parsed.content,
      sortIndex: parsed.sortIndex,
      occurredOn: parsed.occurredOn,
      occurredAt,
      user: { connect: { id: user.id } },
    };

    const data = await prisma.journalEntry.create({
      data: prismaData,
    });

    revalidatePath("/journal");

    return success(data, "Task created");
  } catch (err) {
    console.log(err);
    return fail(500, "Server error");
  }
}

export async function updateJournalEntry(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    const result = createJournalEntrySchema.safeParse({
      ...raw,
      sortIndex: normalizeNumber(raw.sortIndex),
      occurredOn: normalizeDate(raw.occurredOn),
      occurredAt: normalizeDate(raw.occurredAt) ?? "",
    });

    console.log(result);

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    let occurredAt: Date | null = null;

    if (parsed.occurredAt && parsed.occurredOn) {
      const date = new Date(parsed.occurredOn);
      const time = parsed.occurredAt ?? "23:59";

      const [h, m] = time.split(":").map(Number);

      date.setHours(h, m, 0, 0);
      occurredAt = date;
    }

    const data = await prisma.journalEntry.update({
      where: { id: parsed.id },
      data: {
        subject: parsed.subject,
        content: parsed.content,
        sortIndex: parsed.sortIndex,
        occurredOn: parsed.occurredOn,
        occurredAt,
      },
    });

    revalidatePath("/tasks");

    return success(data, "Task updated");
  } catch (err) {
    console.log(err);
    return fail(500, "Server error");
  }
}

export async function deleteJournalEntry(id: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    await prisma.task.delete({ where: { id } });

    revalidatePath("/journal");

    return success(null);
  } catch {
    return fail(500, "Server Error");
  }
}
