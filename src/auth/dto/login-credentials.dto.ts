import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
