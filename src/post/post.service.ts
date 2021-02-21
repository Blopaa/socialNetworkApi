import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/entities/comment.entity';
import ErrorDto from 'src/dto/errorDto';
import { ProfileService } from 'src/profile/profile.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRespository: Repository<Post>,

    @Inject(forwardRef(() => ProfileService))
    private profileServices: ProfileService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postRespository.create({
      message: createPostDto.message,
    });
    post.profile = await this.profileServices
      .findOne(createPostDto.profileId)
      .catch((err) => {
        throw err;
      });
    return await this.postRespository.save(post);
  }

  async findAll() {
    return await this.postRespository.find();
  }

  async getPosts(order: number){
    const allPosts = await this.postRespository.find({order: {createdAt: "ASC"}})
    return allPosts.slice(order * 10, (order*10) + 9)
  }

  async findOne(id: number) {
    return await this.postRespository.findOneOrFail(id).catch(() => {
      throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRespository.findOneOrFail(id).catch(() => {
      throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
    });
    return await this.postRespository.merge(post, updatePostDto);
  }

  async remove(id: number) {
    return await this.postRespository.delete(id).catch(() => {
      throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
    });
  }

  async getPostLikes(id: number) {
    const post = await this.postRespository.findOne(id, {
      relations: ['profile_likes'],
    });

    return post.profile_likes
  }
}
