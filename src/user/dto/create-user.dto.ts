import { PrimaryColumn } from 'typeorm';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
}
