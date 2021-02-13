import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileModule } from 'src/profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]),  ProfileModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
