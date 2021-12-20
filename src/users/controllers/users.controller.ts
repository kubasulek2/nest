import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../../shared/interceptors/serialize.interceptors';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { WithError } from '../../shared/decorators/with-error.decorator';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDto } from '../dtos/user.dto';
import { CurrrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { AuthGuard } from '../../shared/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  async getUser(@CurrrentUser() user: User | null) {
    return user;
  }

  @Post('/signup')
  @WithError()
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  @WithError()
  async login(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    console.log('session:', session);
    return user;
  }

  @Post('/signout')
  @WithError()
  async logout(@Session() session: any) {
    delete session.userId;
  }

  @Get('/:id')
  @WithError()
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Get('/')
  @WithError()
  findUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  @WithError()
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }

  @Delete('/:id')
  @WithError()
  async removeUser(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
