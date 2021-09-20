import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardListDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
