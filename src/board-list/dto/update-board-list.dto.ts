import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardListDto } from './create-board-list.dto';

export class UpdateBoardListDto extends PartialType(CreateBoardListDto) {}
