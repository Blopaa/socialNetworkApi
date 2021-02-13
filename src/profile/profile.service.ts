import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ErrorDto from 'src/dto/errorDto';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRespository: Repository<Profile>,

    @Inject(forwardRef(() => PostService))
    private postServices: PostService
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRespository.create(createProfileDto);
    const profileSaved = await this.profileRespository.save(profile);
    return profileSaved;
  }

  async findAll() {
    return await this.profileRespository.find().catch((err: ErrorDto) => {
      throw new ErrorDto(
        'tried to find entities in profile table but an error ocurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  async findOne(id: number) {
    return await this.profileRespository
      .findOneOrFail(id)
      .catch((err: ErrorDto) => {
        throw new ErrorDto('profile not found', HttpStatus.NOT_FOUND);
      });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRespository
      .findOneOrFail(id)
      .catch((err: ErrorDto) => {
        throw new ErrorDto('profile not found', HttpStatus.NOT_FOUND);
      });

    return this.profileRespository.merge(profile, updateProfileDto);
  }

  async remove(id: number) {
    await this.profileRespository.delete(id).catch((err: ErrorDto) => {
      throw new ErrorDto('profile not found', HttpStatus.NOT_FOUND);
    });
  }

  async profileLikes(profileId: number, postId: number) {
    const profile = await this.profileRespository
      .findOneOrFail(profileId, { relations: ['user_follow'] })
      .catch(() => {
        throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
      });
    const post = await this.postServices.findOne(postId);
    if (profile.profile_likes.find(p => p.id === post.id)) {
      profile.profile_likes = profile.profile_likes.filter(p => p.id !== post.id);
    } else {
      profile.profile_likes = [...profile.profile_likes, post];
    }

    await this.profileRespository.save(profile);
  }
}
