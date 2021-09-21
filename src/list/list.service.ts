import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entities/board.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities/list.entity';
import { ListRepository } from './entities/list.repository';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(ListRepository)
    private listRepository: ListRepository,
  ) {}

  async create(createListDto: CreateListDto, board: Board): Promise<List> {
    // get last list order
    const query = await this.listRepository
      .createQueryBuilder('bl')
      .select('max(bl.order)', 'order')
      .where('boardId = :boardId', { boardId: board.id })
      .getRawOne();
    const lastListOrder = +query['order'];

    const { title } = createListDto;
    const list = new List();
    list.title = title;
    list.board = board;
    list.order = lastListOrder + 1;
    await list.save();

    delete list.board;
    return list;
  }

  async findOne(id: number, boardId: number): Promise<List> {
    const list = await this.listRepository.findOne({
      id: id,
      boardId: boardId,
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    return list;
  }

  async update(
    id: number,
    boardId: number,
    updateListDto: UpdateListDto,
  ): Promise<List> {
    const { title } = updateListDto;
    const list = await this.findOne(id, boardId);
    list.title = title;
    await list.save();

    return list;
  }

  async remove(id: number, boardId: number): Promise<List> {
    const list = await this.findOne(id, boardId);

    return list.remove();
  }

  //* 1. Get left list
  //* 2. Exchange left list order to selected list order
  // async moveLeft(id: number, boardId: number): Promise<void> {
  //   const list = await this.findOne(id, boardId);
  //   const listOrder = list.order;

  //   // get nearest smaller order board (left list)
  //   const query = await this.listRepository
  //     .createQueryBuilder('bl')
  //     .where('bl.boardId = :boardId', { boardId: boardId })
  //     .andWhere('bl.order < :order', { order: listOrder })
  //     .orderBy(`bl.order`, 'DESC')
  //     .limit(1)
  //     .getMany();

  //   // if list is leftmost/rightmost
  //   if (query.length === 0 || query === undefined) {
  //     console.log('leftmost');
  //     return;
  //   }

  //   const leftList = query[0];
  //   const leftListOrder = leftList.order;

  //   // exchange order
  //   leftList.order = listOrder;
  //   list.order = leftListOrder;

  //   // update
  //   await list.save();
  //   await leftList.save();
  // }

  // async moveRight(id: number, boardId: number) {
  //   const list = await this.findOne(id, boardId);
  //   const listOrder = list.order;

  //   const query = await this.listRepository
  //     .createQueryBuilder('list')
  //     .where('list.boardId = :boardId', { boardId: boardId })
  //     .andWhere('list.order > :order', { order: listOrder })
  //     .orderBy(`list.order`, 'ASC')
  //     .limit(1)
  //     .getMany();

  //   if (query.length === 0 || query === undefined) {
  //     console.log('rightmost');
  //     return;
  //   }

  //   const rightList = query[0];
  //   const leftListOrder = rightList.order;

  //   rightList.order = listOrder;
  //   list.order = leftListOrder;

  //   await list.save();
  //   await rightList.save();
  // }
}
