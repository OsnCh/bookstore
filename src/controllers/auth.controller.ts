import { Controller, Body, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../services';
import { TokenAuthModel, UserModel, SignUpAuthModel } from '../models'
import {
  ApiBearerAuth,
  ApiUseTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SignInAuthModel } from 'src/models/auth/signIn.model';
import { Roles } from 'src/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/entities';

@ApiBearerAuth()
@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signIn')
  @ApiOkResponse({ type: TokenAuthModel })
  async signIn(@Body() model: SignInAuthModel): Promise<TokenAuthModel> {
    return await this.authService.signIn(model);
  }

  @Post('signUp')
  @ApiOkResponse({ type: TokenAuthModel })
  async signUp(@Body() model: SignUpAuthModel): Promise<TokenAuthModel> {
    return await this.authService.signUp(model);
  }

  @Get('users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: TokenAuthModel, isArray: true })
  async getAll(): Promise<UserModel[]> {
    return await this.authService.getAll();
  }
}
