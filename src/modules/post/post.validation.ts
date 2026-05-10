import z from "zod";
import { BadRequestException, generalFields as GF } from "../../common";

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

export const addReactionPostSchema = z.object({
  postId: GF.id,
  reaction: GF.reaction,
});

export const updatePostSchema = z.object({
  content: GF.content,
  attachments: GF.attachments,
});

export const listPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});