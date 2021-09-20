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
import { BoardGuard } from 'src/board/board.guard';
import { Board } from 'src/board/entities/board.entity';
import { GetBoard } from 'src/board/get-board.decorator';
import { BoardListService } from './board-list.service';
import { CreateBoardListDto } from './dto/create-board-list.dto';
import { UpdateBoardListDto } from './dto/update-board-list.dto';
import { BoardList } from './entities/board-list.entity';

@Controller('board/:board')
@UseGuards(JwtAuthGuard, BoardGuard)
export class BoardListController {
  constructor(private readonly boardListService: BoardListService) {}

  @Post('/list')
  async create(
    @Body() createBoardListDto: CreateBoardListDto,
    @GetBoard() board: Board,
  ): Promise<BoardList> {
    return this.boardListService.create(createBoardListDto, board);
  }

  @Patch('/list/:id')
  async update(
    @Param('id') id: string,
    @GetBoard() board: Board,
    @Body() updateBoardListDto: UpdateBoardListDto,
  ): Promise<BoardList> {
    return this.boardListService.update(+id, board.id, updateBoardListDto);
  }

  @Delete('/list/:id')
  async delete(
    @Param('id') id: string,
    @GetBoard() board: Board,
  ): Promise<BoardList> {
    return this.boardListService.remove(+id, board.id);
  }

  @Post('/list/:id/right')
  async moveRight(
    @Param('id') id: string,
    @GetBoard() board: Board,
  ): Promise<void> {
    return this.boardListService.moveRight(+id, board.id);
  }

  @Post('/list/:id/left')
  async moveLeft(
    @Param('id') id: string,
    @GetBoard() board: Board,
  ): Promise<void> {
    return this.boardListService.moveLeft(+id, board.id);
  }
}
