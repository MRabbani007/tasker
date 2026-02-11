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

export async function getDashboardLists() {
  const user = await getCurrentUser();
  if (!user) return [];

  return await prisma.taskList.findMany({
    where: { userId: user.id, deletedAt: null },
    take: 3,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      details: true,
      _count: {
        select: { tasks: { where: { completed: false, deletedAt: null } } },
      },
    },
  });
}

export async function getTaskListsWithSummary({
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

    if (!user) return failData(403, [], "Un-Authorized");

    const skip = (page - 1) * itemsPerPage;
    const take = itemsPerPage;

    const whereClause: Prisma.TaskListWhereInput = {
      userId: user.id,
      ...(filters?.query && {
        OR: [
          { title: { contains: filters.query, mode: "insensitive" } },
          { subtitle: { contains: filters.query, mode: "insensitive" } },
          { details: { contains: filters.query, mode: "insensitive" } },
        ],
      }),
    };

    const orderBy: Prisma.TaskListOrderByWithRelationInput = sort
      ? { [sort.field]: sort.direction }
      : { sortIndex: "asc" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    const [lists, count] = await prisma.$transaction([
      prisma.taskList.findMany({
        where: whereClause,
        take,
        skip,
        orderBy,
      }),

      prisma.taskList.count({ where: whereClause }),

      // prisma.task.groupBy({
      //   by: ["taskListId"],
      //   where: {
      //     taskList: { userId: user.id },
      //   },
      //   _count: {
      //     id: true,
      //   },
      //   orderBy: { taskListId: "asc" },
      // }),
    ]);

    /**
     * More detailed grouped stats
     */
    const stats = await prisma.$queryRaw<
      {
        taskListId: string;
        important: number;
        dueToday: number;
        dueThisWeek: number;
        overdue: number;
        open: number;
        completed: number;
      }[]
    >`
      SELECT
        "taskListId",
        COUNT(*) FILTER (WHERE "priority" >= 3 AND "completed" = false) AS important,
        COUNT(*) FILTER (WHERE "dueOn"::date = CURRENT_DATE AND "completed" = false) AS "dueToday",
        COUNT(*) FILTER (
          WHERE "dueOn" > CURRENT_DATE
          AND "dueOn" <= CURRENT_DATE + INTERVAL '7 days'
          AND "completed" = false
        ) AS "dueThisWeek",
        COUNT(*) FILTER (WHERE "dueOn" < CURRENT_DATE AND "completed" = false) AS overdue,
        COUNT(*) FILTER (WHERE "completed" = false) AS open,
        COUNT(*) FILTER (WHERE "completed" = true) AS completed
      FROM "Task"
      GROUP BY "taskListId"
    `;

    const statsMap = new Map(stats.map((s) => [s.taskListId, s]));

    const data = lists.map((list) => ({
      ...list,
      summary: statsMap.get(list.id) ?? {
        important: 0,
        dueToday: 0,
        dueThisWeek: 0,
        overdue: 0,
        open: 0,
        completed: 0,
      },
    }));

    return success(data, "", count);
  } catch (e) {
    console.error(e);
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

    return success(data);
  } catch {
    return failData(500, null, "Server error");
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
