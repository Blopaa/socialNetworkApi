import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ErrorDto from 'src/dto/errorDto';
import { PostService } from 'src/post/post.service';
import { ProfileService } from 'src/profile/profile.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRespository: Repository<Comment>,

    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,

    @Inject(forwardRef(() => PostService))
    private postService: PostService,
  ) {}

  async create({ message, profileId, postId }: CreateCommentDto) {
    const comment = await this.commentRespository.create({ message });
    comment.profile = await this.profileService
      .findOne(profileId)
      .catch((err) => {
        throw err;
      });
    comment.post = await this.postService.findOne(postId).catch((err) => {
      throw err;
    });

    return await this.commentRespository.save(comment);
  }

  async findAll() {
    return await this.commentRespository.find();
  }

  async findOne(id: number) {
    return await this.commentRespository.findOneOrFail(id).catch(() => {
      throw new ErrorDto('comment not found', HttpStatus.NOT_FOUND);
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id).catch((err) => {
      throw err;
    });
    return await this.commentRespository.merge(comment, updateCommentDto);
  }

  async remove(id: number) {
    return await this.commentRespository.delete(id).catch(() => {
      throw new ErrorDto('comment not found', HttpStatus.NOT_FOUND);
    });
  }

  async getPostComments(postId: number){
    const post = await this.postService.findOne(postId)
    const comments = await this.commentRespository.find({where: {post: post}})
    return comments
  }
}
