import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import ErrorDto from 'src/dto/errorDto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import User from './entities/user.entity';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AuthUserDto } from './dto/auth-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UserService {


  constructor(
    @InjectRepository(User)
    private userRespository: Repository<User>,

    @Inject(ProfileService)
    private profileService: ProfileService
  ){}

  private async jwtcreation(savedUser: User) {
    return {
      token: sign({ id: savedUser.id }, process.env.SECRET || '', {
        expiresIn: 172800,
      }),
    };
  }

  private async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async comparePasswords(
    savedPassword: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, savedPassword);
  }

  async signUp(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const newUser = await this.userRespository.create(createUserDto);
    newUser.password = await this.encryptPassword(createUserDto.password);
    const profile = await this.profileService.create({nickname: createUserDto.nickname});
    newUser.profile = profile
    const savedUser = await this.userRespository
      .save(newUser)
      .catch((err) => {
        throw new ErrorDto(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      });
    return this.jwtcreation(savedUser);
  }

  async signIn(authUserDto: AuthUserDto): Promise<{ token: string }> {
    const user = await this.userRespository
      .findOneOrFail({
        where: { email: authUserDto.email },
      })
      .catch(() => {
        throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
      });

    const matchPassword = await this.comparePasswords(
      user.password,
      authUserDto.password,
    );

    if (matchPassword) {
      return this.jwtcreation(user);
    } else {
      throw new ErrorDto('password mismatch', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    const user = (await this.userRespository.find()) as UserDto[];
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRespository
      .findOneOrFail()
      .catch(() => {
        throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
      });
    return user as UserDto;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.userRespository
      .findOneOrFail(id)
      .catch(() => {
        throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
      });

    await this.userRespository.merge(user, updateUserDto);
    this.userRespository.save(user);
    return user as UserDto;
  }

  async remove(id: number): Promise<void> {
    await this.userRespository
      .delete(id)
      .catch(() => {
        throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
      });
  }
}
