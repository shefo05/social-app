import { Types } from "mongoose";
import { CreatePostDTO } from "./post.dto";
import { postRepo, PostRepository } from "../../DB/models/post/post.repository";

class PostSevice {
  constructor(private readonly _postRepo: PostRepository) {}

  async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId) {
    return await this._postRepo.create({ ...createPostDTO, userId });
  }
}

export default new PostSevice(postRepo);
