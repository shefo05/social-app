import z from "zod";
import { createCommentSchema } from "./comment.validation";

export type CreateCommentDTO = z.infer<typeof createCommentSchema>