import { Controller, Get, Post, Body, Put, Param, Delete, Req } from "@nestjs/common";
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { TokenRequest } from "../token-verification.middleware";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get('/find-one')
  findOne(@Req() req: TokenRequest) {
    return this.profileService.findOne(req.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

  @Post(':postId')
  giveLike(@Param() {postId}: { postId: number}, @Req() req: TokenRequest){
    return this.profileService.profileLikes(req.userId, postId)
  }

  @Get("/user-likes")
  getUserLikes(@Req() req: TokenRequest){
    return this.profileService.getProfileLikes(req.userId)
  }

  @Get("/find-nickname/:nickname")
  findByNickname(@Param("nickname") p: string){
    return this.profileService.findByNickName(p)
  }

  @Get("/find-one-nickname/:nickname")
  findOneByNickname(@Param("nickname") p: string){
    return this.profileService.findOneByNickName(p);
  }
}
