import { z } from "zod";

export const uuidSchema = z.uuid();
export const dateSchema = z.coerce.date();
