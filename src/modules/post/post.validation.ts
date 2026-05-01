import z from "zod";
import {
  BadRequestException,
  generalFields as GF,
  SYS_REACTION,
} from "../../common";

export const createPostSchema = z
  .object({
    content: GF.content,
    attachments: GF.attachments,
  })
  .refine((data) => {
    const { attachments, content } = data;
    if (!content && (!attachments || attachments.length === 0)) {
      throw new BadRequestException("content or attachments must be provided");
    }
    return true;
  });


