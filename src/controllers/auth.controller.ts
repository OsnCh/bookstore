import { Controller, Body, Post, Get, UseGuards, Param } from '@nestjs/common';
import { AuthService } from '../services';
import {
  ApiBearerAuth,
  ApiUseTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SignInAuthModel } from 'src/models/auth/signIn.model';
import { Roles, JwtAuthGuard, ExceptionHandlerFilter } from 'src/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/entities';
import { TokenAuthModel } from 'src/models/auth/tokenAuth.model';
import { SignUpAuthModel } from 'src/models/auth/signUp.model';
import { UserModel } from 'src/models/auth/user.model';

@ApiBearerAuth()
@ApiUseTags('api/auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signIn')
  @ApiOkResponse({ type: TokenAuthModel })
  async signIn(@Body() model: SignInAuthModel): Promise<TokenAuthModel> {
    return await this.authService.signIn(model);
  }

  @Post('signUp')
  @ApiOkResponse({ type: TokenAuthModel })
  async signUp(@Body() model: SignUpAuthModel): Promise<string> {
    return await this.authService.signUp(model);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: TokenAuthModel, isArray: true })
  async getAll(): Promise<UserModel[]> {
    return await this.authService.getAll();
  }

  @Get('confirm/:token')
  @ApiOkResponse({type: String})
  async emailConfirm(@Param('token') token: string): Promise<string>{
    return await this.authService.confirmEmail(token);
  }
}
