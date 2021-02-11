import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ErrorDto from 'src/dto/errorDto';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(Profile)
    private profileRespository: Repository<Profile>
  ){}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRespository.create(createProfileDto)
    const profileSaved = await this.profileRespository.save(profile)
    return profileSaved;
  }

  async findAll() {
   return await this.profileRespository.find().catch((err: ErrorDto) => {
     throw new ErrorDto('tried to find entities in profile table but an error ocurred', HttpStatus.INTERNAL_SERVER_ERROR)
   })
  }

  async findOne(id: number) {
    return await this.profileRespository.findOneOrFail(id).catch((err: ErrorDto) => {
      throw new ErrorDto('profile not found', HttpStatus.NOT_FOUND)
    })
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRespository.findOneOrFail(id).catch((err: ErrorDto) => {
      throw new ErrorDto('profile not found', HttpStatus.NOT_FOUND)
    })

    return this.profileRespository.merge(profile, updateProfileDto)
  }

  async remove(id: number) {
    await this.profileRespository.delete(id).catch((err: ErrorDto) => {
      throw new ErrorDto('profile not found', HttpStatus.NOT_FOUND)
    })
  }
}
