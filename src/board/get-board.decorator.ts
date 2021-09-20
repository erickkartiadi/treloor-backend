import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetBoard = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.board;
  },
);
