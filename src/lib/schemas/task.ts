import z from "zod";
import { dateSchema, uuidSchema } from "./helpers";

export const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().nullable(),
  task: z.string().nullable(),
  details: z.string().nullable(),
  notes: z.string().nullable(),

  priority: z.number().int().min(1).max(5).optional().default(1),
  color: z.string().nullable(),

  link: z.string().nullable(),
  linkText: z.string().nullable(),

  sortIndex: z.number().int().optional().default(0),
  plannerSortIndex: z.number().int().optional().default(0),

  completed: z.boolean().default(false),
  status: z.string().nullable(),

  createdAt: dateSchema,
  updatedAt: dateSchema,

  dueOn: z.coerce.date().optional().nullable(),
  dueAt: z.string().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),

  taskListId: z.string("TaskList is required").nullable().optional(),
});

export type TaskInput = z.infer<typeof TaskSchema>;

export const TaskCompleteSchema = z.object({
  id: z.string().optional(),
  completed: z.boolean().default(false),
  completedAt: dateSchema.nullable(),
});

export const MoveTaskSchema = z.object({
  id: z.string().optional(),
  taskListId: z.string(),
});

export type MoveTaskInput = z.infer<typeof MoveTaskSchema>;

export const CreateTaskSchema = z.object({
  title: z.string().optional(),
  task: z.string().optional(),
  details: z.string().optional(),
  notes: z.string().optional(),

  priority: z.number().int().min(0).optional(),
  color: z.string().optional(),

  link: z.string().optional(),
  linkText: z.string().optional(),

  sortIndex: z.number().int().optional(),
  plannerSortIndex: z.number().int().optional(),

  completed: z.boolean().optional(),
  status: z.string().optional(),

  dueOn: dateSchema.optional(),
  dueAt: dateSchema.optional(),

  userId: uuidSchema.optional(),
  taskListId: uuidSchema.optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  id: uuidSchema,
  completedAt: dateSchema.optional(),
  deletedAt: dateSchema.optional(),
});
