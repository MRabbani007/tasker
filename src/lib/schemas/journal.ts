import z from "zod";

export const JournalEntryTypeEnum = z.enum([
  "TASK",
  "NOTE",
  "HIGHLIGHT",
  "ROUTINE",
  "REFLECTION",
]);

export const createJournalEntrySchema = z.object({
  id: z.uuid().optional(),

  type: JournalEntryTypeEnum,

  subject: z
    .string()
    .trim()
    .min(1, "Subject cannot be empty")
    .max(120, "Subject is too long")
    .nullable()
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(10_000, "Content is too long"),

  occurredOn: z.coerce.date(),
  occurredAt: z.string(),

  sortIndex: z.number().int().min(0).default(0),
});

export const updateJournalEntrySchema = z.object({
  type: JournalEntryTypeEnum.optional(),

  subject: z.string().trim().min(1).max(120).optional(),

  content: z.string().trim().min(1).max(10_000).optional(),

  occurredOn: z.coerce.date().optional().nullable(),
  occurredAt: z.string().optional(),

  sortIndex: z.number().int().min(0).optional(),
});

export const createTaskSnapshotSchema = z.object({
  taskId: z.string().min(1),

  title: z.string().trim().min(1).max(255),
  listName: z.string().trim().max(120).optional(),
  priority: z.number().int().min(0).max(5).optional(),

  tags: z.array(z.string().trim().max(50)).max(20).optional(),
  note: z.string().trim().max(2_000).optional(),
});

export const createJournalWithTaskSchema = z.object({
  journalEntry: createJournalEntrySchema.extend({
    type: z.literal("TASK"),
  }),
  taskSnapshot: createTaskSnapshotSchema,
});

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;

export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;

export type CreateJournalWithTaskInput = z.infer<
  typeof createJournalWithTaskSchema
>;
