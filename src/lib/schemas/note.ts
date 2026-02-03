import z from "zod";
import { dateSchema, uuidSchema } from "./helpers";

export const NoteSchema = z.object({
  id: z.string().optional(),

  title: z.string().nullable(),
  details: z.string().nullable(),

  sortIndex: z.number().int().default(0),

  openedAt: dateSchema.nullable(),
  pinnedAt: dateSchema.nullable(),
  deletedAt: dateSchema.nullable(),
});

export const CreateNoteSchema = z.object({
  title: z.string().optional(),
  details: z.string().optional(),

  sortIndex: z.number().int().optional(),

  openedAt: dateSchema.optional(),
  pinnedAt: dateSchema.optional(),

  userId: uuidSchema.optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.partial().extend({
  deletedAt: dateSchema.optional(),
});
