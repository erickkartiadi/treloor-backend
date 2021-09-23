import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BoardService } from './board.service';

@Injectable()
export class BoardGuard implements CanActivate {
  constructor(private readonly boardService: BoardService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const boardId = req.params.board;

    try {
      const board = await this.boardService.validateBoardMember(
        boardId,
        user.id,
      );
      req.board = board;
      return true;
    } catch (err) {
      throw new ForbiddenException("You don't have access to that board");
    }
  }
}
