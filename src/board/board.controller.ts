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
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { BoardService } from './board.service';
import { AddBoardMemberDto } from './dto/add-member.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Controller('board')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAllBoard(@GetUser() user: User): Promise<Board[]> {
    return this.authService.findAllBoards(user);
  }

  @Get(':id')
  async openBoard(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardService.openBoard(user, +id);
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardService.create(createBoardDto, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body(new ValidationPipe()) updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardService.update(+id, user.id, updateBoardDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User): Promise<Board> {
    return this.boardService.remove(+id, user.id);
  }

  @Post(':id/member')
  async addMember(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body(new ValidationPipe()) addBoardMemberDto: AddBoardMemberDto,
  ): Promise<void> {
    const { email } = addBoardMemberDto;
    const newMember = await this.authService.findUserByEmail(email);

    return this.boardService.addMember(user, newMember, +id);
  }

  @Delete(':id/member/:memberId')
  async removeMember(
    @GetUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ): Promise<void> {
    return this.boardService.removeMember(user, +memberId, +id);
  }
}
