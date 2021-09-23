import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Board } from 'src/board/entities/board.entity';
import { GetBoard } from 'src/board/get-board.decorator';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities/list.entity';
import { BoardGuard } from 'src/board/board.guard';

@Controller('board/:board')
@UseGuards(JwtAuthGuard, BoardGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post('/list')
  async create(
    @Body() createListDto: CreateListDto,
    @GetBoard() board: Board,
  ): Promise<List> {
    return this.listService.create(createListDto, board);
  }

  @Patch('/list/:id')
  async update(
    @Param('id') id: string,
    @GetBoard() board: Board,
    @Body() updateListDto: UpdateListDto,
  ): Promise<List> {
    return this.listService.update(+id, board.id, updateListDto);
  }

  @Delete('/list/:id')
  async delete(
    @Param('id') id: string,
    @GetBoard() board: Board,
  ): Promise<List> {
    return this.listService.remove(+id, board.id);
  }

  // @Post('/list/:id/right')
  // async moveRight(
  //   @Param('id') id: string,
  //   @GetBoard() board: Board,
  // ): Promise<void> {
  //   return this.listService.moveRight(+id, board.id);
  // }

  // @Post('/list/:id/left')
  // async moveLeft(
  //   @Param('id') id: string,
  //   @GetBoard() board: Board,
  // ): Promise<void> {
  //   return this.listService.moveLeft(+id, board.id);
  // }
}
