import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { BoardRepository } from './entities/board.repository';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository) private boardRepository: BoardRepository,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = new Board();
    board.title = title;
    board.description = description;
    board.user = user;
    await board.save();

    delete board.user;
    return board;
  }

  async findAll(user: User): Promise<Board[]> {
    return user.boards;
  }

  async findOne(id: number, userId: number): Promise<Board> {
    const board = await this.boardRepository.findOne({
      id: id,
      userId: userId,
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async update(
    id: number,
    userId: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const board = await this.findOne(id, userId);
    board.title = updateBoardDto.title;
    board.description = updateBoardDto.description;
    await board.save();
    return board;
  }

  async remove(id: number, userId: number): Promise<Board> {
    const board = await this.findOne(id, userId);
    return board.remove();
  }
}
