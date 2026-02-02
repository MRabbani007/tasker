"use server";

import { getCurrentUser } from "@/lib/auth/utils";
import { fail, failData, success } from "../actionResponse";
import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { formDataToObject, normalizeNumber } from "@/lib/helpers";
import { TaskListSchema } from "@/lib/schemas/taskList";
import { revalidatePath } from "next/cache";

export async function getTaskLists({
  itemsPerPage = 20,
  page = 1,
  filters,
  sort,
}: {
  itemsPerPage?: number;
  page?: number;
  sort?: Sort;
  filters?: TaskListFilters;
}) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const skip = (page - 1) * itemsPerPage;
    const take = itemsPerPage;

    const whereClause: Prisma.TaskListWhereInput = { userId: user.id };

    if (filters?.query) {
      whereClause.OR = [
        { title: { contains: filters.query, mode: "insensitive" } },
        { subtitle: { contains: filters.query, mode: "insensitive" } },
        { details: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    const orderByClause: Prisma.TaskListOrderByWithRelationInput | undefined =
      sort ? { [sort.field]: sort.direction } : { sortIndex: "asc" };

    const [data, count] = await prisma.$transaction([
      prisma.taskList.findMany({
        where: whereClause,
        take,
        skip,
        orderBy: orderByClause,
      }),
      prisma.taskList.count({
        where: whereClause,
      }),
    ]);

    return success(data, "", count);
  } catch {
    return failData(500, [], "Server Error");
  }
}

export async function getTaskListById(id: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, null, "Un-Authorized");
    }

    const data = await prisma.taskList.findFirst({
      where: { id, userId: user.id },
      // include: { tasks: true },
    });

    return success(data)
  } catch {
    return failData(500,null,"Server error")

  }
}

export async function createTaskList(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    const result = TaskListSchema.safeParse({
      ...raw,
      sortIndex: normalizeNumber(raw.sortIndex),
    });

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    const data = await prisma.taskList.create({
      data: {
        title: parsed.title,
        subtitle: parsed.subtitle,
        details: parsed.details,
        status: parsed.status,
        sortIndex: parsed.sortIndex,
        type: parsed.type,
        icon: parsed.icon,
        userId: user.id,
      },
    });

    console.log(data);

    revalidatePath("/tasks");

    return success(data, "Task created");
  } catch {
    return fail(500, "Server error");
  }
}

export async function updateTaskList(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    const result = TaskListSchema.safeParse({
      ...raw,
      sortIndex: normalizeNumber(raw.sortIndex),
      pinnedAt: null,
      deletedAt: null,
    });

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    const data = await prisma.taskList.update({
      where: { id: parsed.id },
      data: {
        title: parsed.title,
        subtitle: parsed.subtitle,
        details: parsed.details,
        status: parsed.status,
        sortIndex: parsed.sortIndex,
        type: parsed.type,
        icon: parsed.icon,
      },
    });

    revalidatePath("/tasks");

    return success(data, "Task updated");
  } catch {
    return fail(500, "Server error");
  }
}

export async function deleteTaskList(id: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    await prisma.taskList.delete({ where: { id } });

    revalidatePath("/tasks");

    return success(null);
  } catch {
    return fail(500, "Server Error");
  }
}
