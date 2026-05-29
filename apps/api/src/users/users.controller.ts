import { Controller, Get, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: { user: { userId: number } }): Promise<UserDto> {
    const user = await this.usersService.findOne(req.user.userId);
    if (!user) throw new NotFoundException();
    return UserDto.from(user);
  }
}
