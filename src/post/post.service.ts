import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import ErrorDto from "src/dto/errorDto";
import { ProfileService } from "src/profile/profile.service";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post } from "./entities/post.entity";
import { createAsCommentDto } from "./dto/createAsComment-dto";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRespository: Repository<Post>,
    @Inject(forwardRef(() => ProfileService))
    private profileServices: ProfileService
  ) {
  }

  async createAsComment({ message, postId }: createAsCommentDto, userId: number) {
    const comment = await this.postRespository.create({ message });
    comment.profile = await this.profileServices
      .findOne(userId)
      .catch((err) => {
        throw err;
      });
    comment.post = await this.findOne(postId).catch((err) => {
      throw err;
    });

    return await this.postRespository.save(comment);
  }

  async create(createPostDto: CreatePostDto, userId:number) {
    const post = this.postRespository.create({
      message: createPostDto.message
    });
    post.profile = await this.profileServices
      .findOne(userId)
      .catch((err) => {
        throw err;
      });
    return await this.postRespository.save(post);
  }

  async findAll() {
    return await this.postRespository.find({relations: ['profile', "post", "comment"]});
  }

  async getPosts(order: number) {
    const allPosts = await this.postRespository.find({
      relations: ["profile", "post", "comment", "post.profile"]
    });
    return allPosts.reverse().slice(0, order * 10 + 10);
  }

  async findOne(id: number) {
    return await this.postRespository.findOneOrFail(id, {relations: ['profile', 'comment', 'post', "comment.profile", "post.profile"]}).catch(() => {
      throw new ErrorDto("user not found", HttpStatus.NOT_FOUND);
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRespository.findOneOrFail(id).catch(() => {
      throw new ErrorDto("user not found", HttpStatus.NOT_FOUND);
    });
    return this.postRespository.merge(post, updatePostDto);
  }

  async remove(id: number, userId: number) {
    const post = await this.findOne(id);
    const profile = await this.profileServices.findOne(userId);
    if(post.profile.id != profile.id){
      return new ErrorDto("not your post", HttpStatus.BAD_REQUEST)
    }
    await this.postRespository.delete(id).catch(() => {
      throw new ErrorDto("user not found", HttpStatus.NOT_FOUND);
    });
    return {message: "succesfully removed"}
  }

  async getPostLikes(id: number) {
    const post = await this.postRespository.findOne(id, {
      relations: ["profile_likes"]
    });

    return post.profile_likes;
  }
}
