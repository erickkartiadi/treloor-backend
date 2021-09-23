import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddBoardMemberDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
