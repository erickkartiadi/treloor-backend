import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BoardService } from './board.service';

@Injectable()
export class BoardGuard implements CanActivate {
  constructor(private readonly boardService: BoardService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const boardId = req.params.board;

    // if (!board) {
    //   return false;
    // }
    return true;
  }
}
