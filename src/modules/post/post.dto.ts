import z from "zod";
import {
  addReactionPostSchema,
  createPostSchema,
  listPostsQuerySchema,
  updatePostSchema,
} from "./post.validation";

export type CreatePostDTO = z.infer<typeof createPostSchema>;

// export type CreatePostDTO = {
//   content?: string;
//   attachments?: string[];
// };

export type AddReactionDTO = z.infer<typeof addReactionPostSchema>;

// export interface AddReactionDTO {
//   postId: Types.ObjectId;
//   reaction: SYS_REACTION;
// }
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
export type ListPostsQueryDTO = z.infer<typeof listPostsQuerySchema>;
