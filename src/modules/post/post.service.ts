import { Types } from "mongoose";
import { CreatePostDTO } from "./post.dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";

class PostSevice {
  constructor(private readonly _postRepo: PostRepository) {}

  async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId) {
    return await this._postRepo.create({ ...createPostDTO, userId });
  }
}

export default new PostSevice(new PostRepository());
