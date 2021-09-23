import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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
    board.creatorId = user.id;
    board.users = [user];
    await board.save();

    delete board.users;

    return board;
  }

  async update(id: number, userId: number, updateBoardDto: UpdateBoardDto) {
    const { title, description } = updateBoardDto;

    const board = await this.validateBoardMember(id, userId);
    board.title = title;
    board.description = description;
    await board.save();
    delete board.users;
    return board;
  }

  async remove(id: number, userId: number) {
    const board = await this.validateBoardMember(id, userId);

    if (board.creatorId !== userId) {
      throw new ForbiddenException(
        'Only the board creator can delete the board',
      );
    }
    await board.remove();
    delete board.users;
    return board;
  }

  async addMember(user: User, newMember: User, boardId: number): Promise<void> {
    // check if current user is he part of the board (only board member allowed to add another member)
    const board = await this.validateBoardMember(boardId, user.id);

    // check if member is already added to the board
    const countBoardMember = await this.boardRepository.countBoardMember(
      boardId,
      newMember.id,
    );
    if (countBoardMember !== 0) {
      throw new ConflictException(
        `User with email: ${newMember.email} is already a member`,
      );
    }

    board.users.push(newMember);
    await board.save();
  }

  async removeMember(
    user: User,
    memberId: number,
    boardId: number,
  ): Promise<void> {
    const board = await this.validateBoardMember(boardId, user.id);

    // only creator can remove another member AND
    // member can remove themselves
    if (board.creatorId === user.id && memberId === user.id) {
      throw new ForbiddenException(
        'You cannot remove yourself from your own board',
      );
    }

    if (board.creatorId !== user.id && !(memberId === user.id)) {
      throw new ForbiddenException(
        'Only the board creator can remove the member',
      );
    }

    if (memberId === user.id) {
      console.log('You have left the board members');
    }

    const newUsers = board.users.filter((user) => user.id !== memberId);
    board.users = newUsers;
    await board.save();
  }

  /**
   * Return board if user is a member, throw error if user not a member
   * @param boardId number - board id
   * @param userId number - user id
   * @returns Promise<Board>
   */
  async validateBoardMember(boardId: number, userId: number): Promise<Board> {
    const board = await this.boardRepository.findBoardById(boardId);

    const countBoardMember = await this.boardRepository.countBoardMember(
      boardId,
      userId,
    );

    if (countBoardMember <= 0) {
      throw new ForbiddenException('You have to be a member to do that');
    }

    return board;
  }
}
