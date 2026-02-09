import { z } from "zod";

export const uuidSchema = z.uuid();
export const dateSchema = z.coerce.date();

/**
 * Accepts:
 * - Date
 * - ISO string
 * - null / undefined
 */
export const dateInput = z
  .union([z.date(), z.iso.datetime()])
  .optional()
  .nullable();
