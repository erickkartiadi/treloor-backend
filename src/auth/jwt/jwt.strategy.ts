import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { UserRepository } from '../entities/user.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'erick123',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id, username, email } = payload;
    const user: User = await this.userRepository.findOne({
      id: id,
      username: username,
      email: email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
