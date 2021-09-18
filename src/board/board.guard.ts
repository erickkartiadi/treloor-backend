import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardService } from './board.service';

@Injectable()
export class BoardGuard implements CanActivate {
  constructor(private readonly boardService: BoardService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const boardId = req.params.board;

    try {
      const board = await this.boardService.findOne(boardId, userId);
      req.board = board;
      return true;
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
