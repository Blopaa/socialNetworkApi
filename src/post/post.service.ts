import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    @Inject(ProfileService)
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
}
