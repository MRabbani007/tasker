"use server";

import { fail, failData, success } from "../actionResponse";
import { getCurrentUser } from "../../auth/utils";
import { prisma } from "@/lib/prisma";
import {
  formDataToObject,
  normalizeBoolean,
  normalizeDate,
  normalizeNumber,
} from "@/lib/helpers";
import {
  MoveTaskSchema,
  TaskCompleteSchema,
  TaskSchema,
} from "@/lib/schemas/task";
import { revalidatePath } from "next/cache";
import { Prisma } from "../../../../generated/prisma/client";
import { TaskCreateInput } from "../../../../generated/prisma/models";
import { startOfDay, endOfDay, endOfWeek } from "date-fns";

export async function getTasks({
  itemsPerPage = 20,
  page = 1,
  filters,
  sort,
}: {
  itemsPerPage?: number;
  page?: number;
  sort?: Sort;
  filters?: TaskFilters;
}) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const skip = (page - 1) * itemsPerPage;
    const take = itemsPerPage;

    const whereClause: Prisma.TaskWhereInput = { userId: user.id };

    if (filters?.taskList) {
      whereClause.taskListId = filters.taskList;
    }

    if (filters?.query) {
      whereClause.OR = [
        { title: { contains: filters.query, mode: "insensitive" } },
        { task: { contains: filters.query, mode: "insensitive" } },
        { details: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    if (filters?.completed && String(filters.completed) === "true") {
      // whereClause.completed = true;
    } else {
      whereClause.completed = false;
    }

    const orderByClause: Prisma.TaskOrderByWithRelationInput | undefined = sort
      ? { [sort.field]: sort.direction }
      : { updatedAt: "desc" };

    const [data, count] = await prisma.$transaction([
      prisma.task.findMany({
        where: whereClause,
        take,
        skip,
        orderBy: orderByClause,
        include: { taskList: { select: { title: true } } },
      }),
      prisma.task.count({
        where: whereClause,
      }),
    ]);

    return success(data, "", count);
  } catch {
    return failData(500, [], "Server Error");
  }
}

export async function getTaskSummary() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, null, "Un-Authorized");
    }

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Starts Monday

    // We run these in parallel for production-grade speed
    const [
      today,
      overdue,
      highPriorityOverdue,
      thisWeek,
      scheduled,
      flagged,
      completed,
      openTasks,
    ] = await Promise.all([
      // 1. Today: Due today and not completed
      prisma.task.count({
        where: {
          userId: user.id,
          completed: false,
          deletedAt: null,
          dueOn: { gte: todayStart, lte: todayEnd },
        },
      }),
      // 2. Overdue: Due before today and not completed
      prisma.task.count({
        where: {
          userId: user.id,
          completed: false,
          deletedAt: null,
          dueOn: { lt: todayStart },
        },
      }),
      // 3. High Priority Overdue: Overdue AND Priority > 4
      prisma.task.count({
        where: {
          userId: user.id,
          completed: false,
          deletedAt: null,
          dueOn: { lt: todayStart },
          priority: { gt: 4 },
        },
      }),
      // 4. This Week: Due between tomorrow and end of week
      prisma.task.count({
        where: {
          userId: user.id,
          completed: false,
          deletedAt: null,
          dueOn: { gt: todayEnd, lte: weekEnd },
        },
      }),
      // 5. Scheduled: Any future due date
      prisma.task.count({
        where: {
          userId: user.id,
          completed: false,
          deletedAt: null,
          dueOn: { gt: todayEnd },
        },
      }),
      // 6. Flagged: Using priority 5 as "Flagged" (or add a flagged boolean to your model later)
      prisma.task.count({
        where: {
          userId: user.id,
          completed: false,
          deletedAt: null,
          priority: 5,
        },
      }),
      // 7. Completed: Tasks done today
      prisma.task.count({
        where: {
          userId: user.id,
          completed: true,
          deletedAt: null,
          completedAt: { gte: todayStart },
        },
      }),
      // 8. Open Tasks: No due date, not completed
      prisma.task.count({
        where: {
          userId: user.id,
          completed: false,
          deletedAt: null,
          dueOn: null,
        },
      }),
    ]);

    return success({
      today,
      overdue,
      highPriorityOverdue,
      thisWeek,
      scheduled,
      flagged,
      completed,
      openTasks,
    });
  } catch {
    return failData(500, null, "Server Error");
  }
}

export async function createTask(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    const result = TaskSchema.safeParse({
      ...raw,
      completed: normalizeBoolean(raw.completed),
      priority: normalizeNumber(raw.priority),
      sortIndex: normalizeNumber(raw.sortIndex),
      plannerSortIndex: normalizeNumber(raw.plannerSortIndex),
      dueOn: normalizeDate(raw.dueOn),
      completedAt: null,
      deletedAt: null,
    });

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    let dueAt: Date | null = null;

    if (parsed.dueOn) {
      const date = new Date(parsed.dueOn);
      const time = parsed.dueAt ?? "23:59";

      const [h, m] = time.split(":").map(Number);

      date.setHours(h, m, 0, 0);
      dueAt = date;
    }

    const prismaData: TaskCreateInput = {
      title: parsed.title,
      task: parsed.task,
      details: parsed.details,
      sortIndex: parsed.sortIndex,
      color: parsed.color,
      notes: parsed.notes,
      priority: parsed.priority,
      link: parsed.link,
      linkText: parsed.linkText,
      status: parsed.status,
      dueAt,
      dueOn: parsed.dueOn,
      completed: false,
      completedAt: null,
      plannerSortIndex: parsed.plannerSortIndex,
      user: { connect: { id: user.id } },
    };

    if (parsed.taskListId?.trim()) {
      prismaData.taskList = { connect: { id: parsed.taskListId } };
    }

    const data = await prisma.task.create({
      data: prismaData,
    });

    revalidatePath(parsed.taskListId?.trim() ? "/lists" : "/tasks");

    return success(data, "Task created");
  } catch {
    return fail(500, "Server error");
  }
}

export async function updateTask(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    const result = TaskSchema.safeParse({
      ...raw,
      completed: normalizeBoolean(raw.completed),
      priority: normalizeNumber(raw.priority),
      sortIndex: normalizeNumber(raw.sortIndex),
      plannerSortIndex: normalizeNumber(raw.plannerSortIndex),
      dueOn: normalizeDate(raw.dueOn),
      completedAt: null,
      deletedAt: null,
    });

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    let dueAt: Date | null = null;

    if (parsed.dueOn) {
      const date = new Date(parsed.dueOn);
      const time = parsed.dueAt ?? "23:59";

      const [h, m] = time.split(":").map(Number);

      date.setHours(h, m, 0, 0);
      dueAt = date;
    }

    const data = await prisma.task.update({
      where: { id: parsed.id },
      data: {
        title: parsed.title,
        task: parsed.task,
        details: parsed.details,
        color: parsed.color,
        notes: parsed.notes,
        priority: parsed.priority,
        link: parsed.link,
        linkText: parsed.linkText,
        status: parsed.status,
        dueAt,
        dueOn: parsed.dueOn,
        plannerSortIndex: parsed.plannerSortIndex,
      },
    });

    revalidatePath("/tasks");

    return success(data, "Task updated");
  } catch {
    return fail(500, "Server error");
  }
}

export async function updateTaskStatusAction(taskId: string, status: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: status,
        // If moved to DONE, mark as completed
        completed: status === "DONE",
        completedAt: status === "DONE" ? new Date() : null,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/kanban");
  } catch (error) {
    console.error("Failed to update task status:", error);
  }
}

export async function toggleTaskCompleted(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    const result = TaskCompleteSchema.safeParse({
      ...raw,
      completed: normalizeBoolean(raw.completed),
      completedAt: normalizeDate(raw.completedAt),
    });

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    const data = await prisma.task.update({
      where: { id: parsed.id },
      data: {
        completed: parsed.completed,
        completedAt: parsed.completedAt,
      },
    });

    revalidatePath("/lists");

    return success(data, "Task updated");
  } catch {
    return fail(500, "Server error");
  }
}

export async function moveTask(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    const result = MoveTaskSchema.safeParse(raw);

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    const data = await prisma.task.update({
      where: { id: parsed.id },
      data: {
        taskListId: parsed.taskListId,
      },
    });

    revalidatePath("/tasks");

    return success(data, "Task updated");
  } catch {
    return fail(500, "Server error");
  }
}

export async function deleteTask(id: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, [], "Un-Authorized");
    }

    await prisma.task.delete({ where: { id } });

    revalidatePath("/tasks");

    return success(null);
  } catch {
    return fail(500, "Server Error");
  }
}

export async function softDeleteTaskAction(taskId: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/kanban");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete task" };
  }
}
