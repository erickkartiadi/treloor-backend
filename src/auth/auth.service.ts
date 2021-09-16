import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { UserRepository } from './entities/user.repository';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.userRepository.createUser(authCredentialsDto);
  }

  async login(
    loginCredentialsDto: LoginCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(
      loginCredentialsDto,
    );

    // generate jwt token
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken: accessToken,
    };
  }
}
