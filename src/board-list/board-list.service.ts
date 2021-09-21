import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entities/board.entity';
import { CreateBoardListDto } from './dto/create-board-list.dto';
import { UpdateBoardListDto } from './dto/update-board-list.dto';
import { BoardList } from './entities/board-list.entity';
import { BoardListRepository } from './entities/board-list.repository';

@Injectable()
export class BoardListService {
  constructor(
    @InjectRepository(BoardListRepository)
    private boardListRepository: BoardListRepository,
  ) {}

  async create(
    createBoardListDto: CreateBoardListDto,
    board: Board,
  ): Promise<BoardList> {
    // get last board_list order
    const query = await this.boardListRepository
      .createQueryBuilder('bl')
      .select('max(bl.order)', 'order')
      .where('boardId = :boardId', { boardId: board.id })
      .getRawOne();
    const lastBoardListOrder = +query['order'];

    const { title } = createBoardListDto;
    const boardList = new BoardList();
    boardList.title = title;
    boardList.board = board;
    boardList.order = lastBoardListOrder + 1;
    await boardList.save();

    delete boardList.board;
    return boardList;
  }

  async findOne(id: number, boardId: number): Promise<BoardList> {
    const boardList = await this.boardListRepository.findOne({
      id: id,
      boardId: boardId,
    });

    if (!boardList) {
      throw new NotFoundException('List not found');
    }

    return boardList;
  }

  async update(
    id: number,
    boardId: number,
    updateBoardListDto: UpdateBoardListDto,
  ): Promise<BoardList> {
    const { title } = updateBoardListDto;
    const boardList = await this.findOne(id, boardId);
    boardList.title = title;
    await boardList.save();

    return boardList;
  }

  async remove(id: number, boardId: number): Promise<BoardList> {
    const boardList = await this.findOne(id, boardId);

    return boardList.remove();
  }

  //* 1. Get left board_list
  //* 2. Exchange left board_list order to selected board_list order
  async moveLeft(id: number, boardId: number): Promise<void> {
    const boardList = await this.findOne(id, boardId);
    const boardListOrder = boardList.order;

    // get nearest smaller order board (left board_list)
    const query = await this.boardListRepository
      .createQueryBuilder('bl')
      .where('bl.boardId = :boardId', { boardId: boardId })
      .andWhere('bl.order < :order', { order: boardListOrder })
      .orderBy(`bl.order`, 'DESC')
      .limit(1)
      .getMany();

    // if list is leftmost/rightmost
    if (query.length === 0 || query === undefined) {
      console.log('leftmost');
      return;
    }

    const leftBoardList = query[0];
    const leftBoardListOrder = leftBoardList.order;

    // exchange order
    leftBoardList.order = boardListOrder;
    boardList.order = leftBoardListOrder;

    // update
    await boardList.save();
    await leftBoardList.save();
  }

  async moveRight(id: number, boardId: number) {
    const boardList = await this.findOne(id, boardId);
    const boardListOrder = boardList.order;

    const query = await this.boardListRepository
      .createQueryBuilder('bl')
      .where('bl.boardId = :boardId', { boardId: boardId })
      .andWhere('bl.order > :order', { order: boardListOrder })
      .orderBy(`bl.order`, 'ASC')
      .limit(1)
      .getMany();

    if (query.length === 0 || query === undefined) {
      console.log('rightmost');
      return;
    }

    const rightBoardList = query[0];
    const leftBoardListOrder = rightBoardList.order;

    rightBoardList.order = boardListOrder;
    boardList.order = leftBoardListOrder;

    await boardList.save();
    await rightBoardList.save();
  }
}
