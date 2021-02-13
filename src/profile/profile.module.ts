import { forwardRef, Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile } from './entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';

@Module({
  providers: [ProfileService],
  exports: [ProfileService],
  imports: [TypeOrmModule.forFeature([Profile]), forwardRef(() => PostModule)],
  controllers: [ProfileController],
})
export class ProfileModule {}
