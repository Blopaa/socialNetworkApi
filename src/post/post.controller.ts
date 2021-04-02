import { Controller, Get, Post, Body, Put, Param, Delete, Req, HttpException } from "@nestjs/common";
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TokenRequest } from "../token-verification.middleware";
import ErrorDto from "../dto/errorDto";
import { createAsCommentDto } from "./dto/createAsComment-dto";

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: TokenRequest) {
    return this.postService.create(createPostDto, req.userId).catch((err: ErrorDto) => {
      throw new HttpException(err.getMessage, err.getStatus);
    });
  }

  @Get()
  findAll() {
    return this.postService.findAll().catch((err: ErrorDto) => {
      throw new HttpException(err.getMessage, err.getStatus);
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id).catch((err: ErrorDto) => {
      throw new HttpException(err.getMessage, err.getStatus);
    });
  }

  @Post("/comment")
  createAsComment(@Body() b: createAsCommentDto, @Req() req : TokenRequest){
    return this.postService.createAsComment(b, req.userId).catch((err: ErrorDto) => {
      throw new HttpException(err.getMessage, err.getStatus);
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto).catch((err: ErrorDto) => {
      throw new HttpException(err.getMessage, err.getStatus);
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: TokenRequest) {
    return this.postService.remove(+id, req.userId).catch((err: ErrorDto) => {
      throw new HttpException(err.getMessage, err.getStatus);
    });
  }

  @Post('likes/:id')
  getPostLikes(@Param('id') id: number){
    return this.postService.getPostLikes(id).catch((err: ErrorDto) => {
      throw new HttpException(err.getMessage, err.getStatus);
    });
  }

  @Get('/posts/:order')
  getPost(@Param('order') order: number){
    return this.postService.getPosts(order).catch((err: ErrorDto) => {
      throw new HttpException(err.getMessage, err.getStatus);
    });
  }
}
