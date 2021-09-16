import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Controller('board')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardService.create(createBoardDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<Board[]> {
    return this.boardService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.boardService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body(new ValidationPipe()) updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.update(+id, user, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.boardService.remove(+id, user);
  }
}
