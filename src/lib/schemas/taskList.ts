import z from "zod";
import { dateSchema, uuidSchema } from "./helpers";

export const TaskListSchema = z.object({
  id: z.string().optional(),

  title: z.string().nullable(),
  subtitle: z.string().nullable(),
  details: z.string().nullable(),

  status: z.string().nullable(),
  type: z.string().nullable(),
  icon: z.string().nullable(),

  sortIndex: z.number().int().default(0),
});

export type TaskListInput = z.infer<typeof TaskListSchema>;

export const CreateTaskListSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  details: z.string().optional(),

  status: z.string().optional(),
  type: z.string().optional(),
  icon: z.string().optional(),

  sortIndex: z.number().int().optional(),

  pinnedAt: dateSchema.optional(),
  userId: uuidSchema.optional(),
});

export const UpdateTaskListSchema = CreateTaskListSchema.partial().extend({
  deletedAt: dateSchema.optional(),
});
