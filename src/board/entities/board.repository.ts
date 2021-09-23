import { ForbiddenException, NotFoundException } from '@nestjs/common';
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

  /**
   * Return board if user is a member, throw error if user not a member
   * @param boardId number - board id
   * @param userId number - user id
   * @returns Promise<Board>
   */
  async validateBoardMember(boardId: number, userId: number): Promise<Board> {
    const board = await this.findBoardById(boardId);

    const countBoardMember = await this.countBoardMember(boardId, userId);

    if (countBoardMember <= 0) {
      throw new ForbiddenException('You have to be a member to do that');
    }

    return board;
  }
}
