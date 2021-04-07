import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ErrorDto from 'src/dto/errorDto';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { UserService } from "../user/user.service";
import User from "../user/entities/user.entity";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRespository: Repository<Profile>,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,

    @Inject(forwardRef(() => PostService))
    private postServices: PostService
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRespository.create(createProfileDto);
    return await this.profileRespository.save(profile);
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
    const user = await this.userService.findOne(id) as User;
    return await this.profileRespository
      .findOneOrFail({where: {id: user.profile.id}, relations: ['profile_likes']})
      .catch((err: ErrorDto) => {
        throw new ErrorDto('profile not found', HttpStatus.NOT_FOUND);
      });
  }

  async findOneById(id: number) {
    return await this.profileRespository
      .findOneOrFail(id, { relations: ["profile_likes"] })
      .catch((err: ErrorDto) => {
        throw new ErrorDto("profile not found", HttpStatus.NOT_FOUND);
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

  async profileLikes(userId: number, postId: number) {
    const profile = await this.findOne(userId);
    const post = await this.postServices.findOne(postId);
    if (profile.profile_likes.find(p => p.id === post.id)) {
      profile.profile_likes = profile.profile_likes.filter(p => p.id !== post.id);
    } else {
      profile.profile_likes = [...profile.profile_likes, post];
    }

    await this.profileRespository.save(profile);
  }

  async getProfileLikes(userId: number){
    const profile = await this.findOne(userId);
    return profile.profile_likes;
  }

  async findByNickName(nickname: string){
    const profiles =  await this.profileRespository.find()
    return profiles.filter(e => e.nickname.toLowerCase().includes(nickname.toLowerCase()))
  }

  async findOneByNickName(nickname: string){
    return this.profileRespository.findOneOrFail({where: {nickname}, relations: ['post', 'post.profile', 'post.post', 'post.post.profile', 'user_follow', "user_follow.profile",'user', 'user.user_follow']})
  }
}
