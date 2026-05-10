import z from "zod";
import { requestDashboardQuerySchema } from "./request.validation";

export type RequestDashboardQueryDTO = z.infer<
  typeof requestDashboardQuerySchema
>;
