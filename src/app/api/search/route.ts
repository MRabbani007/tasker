import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ status: 401, error: "Un-Authorized" });
  }

  const take = 5;

  const lists = await prisma.taskList.findMany({
    where: {
      userId: user.id,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { subtitle: { contains: q, mode: "insensitive" } },
        { details: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, title: true, subtitle: true },
    take,
  });

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { task: { contains: q, mode: "insensitive" } },
        { details: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, title: true, task: true, details: true },
    take,
  });

  const notes = await prisma.note.findMany({
    where: {
      userId: user.id,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { details: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, title: true, details: true },
    take,
  });

  const data = [
    ...lists.map((item) => ({
      id: item.id,
      type: "tasklist",
      title: item.title,
      details: item.subtitle,
    })),
    ...tasks.map((item) => ({
      id: item.id,
      type: "task",
      title: item.task,
      details: item.title + "|" + item.details,
    })),
    ...notes.map((item) => ({
      id: item.id,
      type: "note",
      title: item.title,
      details: item.details,
    })),
  ];

  return NextResponse.json(data.slice(0, 15));
}
