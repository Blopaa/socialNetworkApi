import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [forwardRef(() => ProfileModule), TypeOrmModule.forFeature([Post])],
  exports: [PostService],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}