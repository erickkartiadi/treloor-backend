import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';

const MYSQL_UNIQUE_CONSTRAINT_VIOLATION = 1062;

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { firstName, lastName, email, password } = authCredentialsDto;

    const user = new User();
    user.firstName = this.capitalizeFirstLetter(firstName);
    user.lastName = this.capitalizeFirstLetter(lastName);
    user.username = await this.generateUsername(user.firstName, user.lastName);
    user.email = email;
    user.password = await this.hashPassword(password);

    try {
      await user.save();
    } catch (err) {
      if (
        err.code === 'ER_DUP_ENTRY' &&
        err.errno === MYSQL_UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new ConflictException(
          `User with email ${user.email} already exists`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async generateUsername(firstName: string, lastName: string): Promise<string> {
    const username = firstName.toLowerCase() + lastName.toLowerCase();
    const userCount = await this.count({
      firstName: firstName,
      lastName: lastName,
    });

    if (userCount > 0) {
      return username + userCount.toString();
    }

    return username;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.findOne({ email: email });
  }

  async validateUserPassword(
    loginCredentialsDto: LoginCredentialsDto,
  ): Promise<User> {
    const { email, password } = loginCredentialsDto;
    const user = await this.findUserByEmail(email);

    if (user && (await user.validatePassword(password))) {
      return user;
    }

    throw new UnauthorizedException('Invalid email or password');
  }
}
