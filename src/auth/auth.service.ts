import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entities/board.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { User } from './entities/user.entity';
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

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    return user;
  }

  async findAllBoards(user: User): Promise<Board[]> {
    const currentUser: User = await this.userRepository.findOne({
      where: { id: user.id },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          boards: 'user.boards',
          users: 'boards.users',
        },
      },
    });

    return currentUser.boards;
  }
}
