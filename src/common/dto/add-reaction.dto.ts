import { Types } from "mongoose";
import { SYS_REACTION } from "../enums";
import z from "zod";
import { generalFields } from "../constant";

// export interface AddReactionDTO {
//   id: Types.ObjectId;
//   reaction: SYS_REACTION;
// }

export const AddReactionSchema = z.object({
  id: generalFields.id,
  reaction: z.enum(SYS_REACTION).default(0),
});
export type AddReactionDTO = z.infer<typeof AddReactionSchema>;