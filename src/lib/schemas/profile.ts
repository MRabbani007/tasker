import z from "zod";

export const profileSchema = z.object({
  taskListId: z.string().optional().nullable(),
  noteId: z.string().optional().nullable(),
  darkMode: z.string().optional().nullable(),
});
