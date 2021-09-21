import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { BoardGuard } from 'src/board/board.guard';
import { BoardListService } from 'src/board-list/board-list.service';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

type TaskParam = {
  board: string;
  list: string;
  id: string;
};

@Controller('/board/:board/list/:list')
@UseGuards(JwtAuthGuard, BoardGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private boardListService: BoardListService,
  ) {}

  @Post('/task')
  async create(
    @Param() params: TaskParam,
    @Body(new ValidationPipe()) createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const { board: boardId, list: boardListId } = params;

    const boardList = await this.boardListService.findOne(
      +boardListId,
      +boardId,
    );

    return this.taskService.create(createTaskDto, boardList);
  }

  @Patch('/task/:id')
  async update(
    @Param() params: TaskParam,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const { board: boardId, list: boardListId, id: taskId } = params;

    const boardList = await this.boardListService.findOne(
      +boardListId,
      +boardId,
    );
    return this.taskService.update(+taskId, boardList.id, updateTaskDto);
  }

  @Delete('/task/:id')
  async remove(@Param() params: TaskParam): Promise<Task> {
    const { board: boardId, list: boardListId, id: taskId } = params;

    const boardList = await this.boardListService.findOne(
      +boardListId,
      +boardId,
    );

    return this.taskService.remove(+taskId, boardList.id);
  }

  @Post('/task/:id/up')
  async moveUp(@Param() params: TaskParam): Promise<void> {
    const { board: boardId, list: boardListId, id: taskId } = params;

    const boardList = await this.boardListService.findOne(
      +boardListId,
      +boardId,
    );

    return this.taskService.moveUp(+taskId, boardList.id);
  }

  @Post('/task/:id/down')
  async moveDown(@Param() params: TaskParam): Promise<void> {
    const { board: boardId, list: boardListId, id: taskId } = params;

    const boardList = await this.boardListService.findOne(
      +boardListId,
      +boardId,
    );

    return this.taskService.moveDown(+taskId, boardList.id);
  }
}
