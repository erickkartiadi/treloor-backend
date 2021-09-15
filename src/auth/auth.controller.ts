import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body(new ValidationPipe()) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    await this.authService.signup(authCredentialsDto);
  }

  @Post('/login')
  async login(
    @Body(new ValidationPipe()) loginCredentialsDto: LoginCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(loginCredentialsDto);
  }
}
