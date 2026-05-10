import z from "zod";
import { createCommentSchema, updateCommentSchema } from "./comment.validation";

export type CreateCommentDTO = z.infer<typeof createCommentSchema>;
export type UpdateCommentDTO = z.infer<typeof updateCommentSchema>;
