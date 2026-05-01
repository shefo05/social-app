import z from "zod";
import { generalFields as GF } from "../../common";

export const createCommentSchema = z.object({
  content: GF.content,
  attachment: z.string().optional(),
  mentions: z.array(z.string()).optional(),
});
