import z from "zod";

export const requestDashboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(5),
});
