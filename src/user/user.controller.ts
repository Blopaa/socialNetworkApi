import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import ErrorDto from 'src/dto/errorDto';
import { UserDto } from './dto/user.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp (@Body() createUserDto: CreateUserDto) {
    return await this.userService.signUp(createUserDto)
  }

  @Post('/signin')
  async signin (@Body() authUserDto: AuthUserDto){
    return await this.userService.signIn(authUserDto).catch((err: ErrorDto) => {
      throw new HttpException(err.getMessage, err.getStatus)
    })
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
