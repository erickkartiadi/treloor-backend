import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { uniqueNamesGenerator } from 'unique-names-generator';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { uniqueNamesGeneratorConfig } from '../lib/unique-names-generator.config';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';

const MYSQL_UNIQUE_CONSTRAINT_VIOLATION = 1062;

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { firstName, lastName, email, password } = authCredentialsDto;

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = await this.generateUniqueUsername();
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
        console.log(err);
      }
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.findOne({ email: email });
  }

  async generateUniqueUsername(): Promise<string> {
    let randomUsername: string;
    let isUsernameExist: boolean;

    do {
      randomUsername = uniqueNamesGenerator(uniqueNamesGeneratorConfig);
      isUsernameExist = (await this.findOne({ username: randomUsername }))
        ? true
        : false;
    } while (isUsernameExist);

    return randomUsername;
  }

  async validateUserPassword(
    loginCredentialsDto: LoginCredentialsDto,
  ): Promise<User> {
    const { email, password } = loginCredentialsDto;
    const user = await this.findUserByEmail(email);

    if (user && (await user.validatePassword(password))) {
      return user;
    }

    return null;
  }
}
