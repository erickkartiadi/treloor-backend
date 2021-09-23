import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Board } from './board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async findBoardById(id: number): Promise<Board> {
    const board = await this.findOne(id, { relations: ['users'] });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async countBoardMember(boardId: number, userId: number): Promise<number> {
    return this.createQueryBuilder('board')
      .leftJoinAndSelect('board.users', 'user')
      .where('board.id = :boardId', { boardId: boardId })
      .andWhere('user.id = :userId', { userId: userId })
      .getCount();
  }
}
