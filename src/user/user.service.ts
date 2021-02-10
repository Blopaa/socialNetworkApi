import { HttpStatus, Injectable } from '@nestjs/common';
import ErrorDto from 'src/dto/errorDto';
import { getRepository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import User from './entities/user.entity';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class UserService {
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
    const newUser = await getRepository(User).create(createUserDto);
    newUser.password = await this.encryptPassword(createUserDto.password);
    const savedUser = await getRepository(User)
      .save(newUser)
      .catch((err) => {
        throw new ErrorDto(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      });
    return this.jwtcreation(savedUser);
  }

  async signIn(authUserDto: AuthUserDto): Promise<{ token: string }> {
    const user = await getRepository(User)
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
    const user = (await getRepository(User).find()) as UserDto[];
    return user;
  }

  async findOne(id: number) {
    const user = await getRepository(User)
      .findOneOrFail()
      .catch((e) => {
        throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
      });
    return user as UserDto;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await getRepository(User)
      .findOneOrFail(id)
      .catch((e) => {
        throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
      });

    await getRepository(User).merge(user, updateUserDto);
    getRepository(User).save(user);
    return user as UserDto;
  }

  async remove(id: number): Promise<void> {
    await getRepository(User)
      .delete(id)
      .catch((e) => {
        throw new ErrorDto('user not found', HttpStatus.NOT_FOUND);
      });
  }
}
