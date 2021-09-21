import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/list/entities/list.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskRepository } from './entities/task.repository';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto, list: List): Promise<Task> {
    // get last task order
    const query = await this.taskRepository
      .createQueryBuilder('task')
      .select('max(task.order)', 'order')
      .where('listId = :listId', { listId: list.id })
      .getRawOne();
    const lastTaskOrder = +query['order'];

    const { title } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.order = lastTaskOrder + 1;
    task.list = list;
    await task.save();

    delete task.list;
    return task;
  }

  findAll() {
    return `This action returns all task`;
  }

  async findOne(id: number, listId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      id: id,
      listId: listId,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    id: number,
    listId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const { title } = updateTaskDto;

    const task = await this.findOne(id, listId);
    task.title = title;
    await task.save();

    return task;
  }

  async remove(id: number, listId: number): Promise<Task> {
    const task = await this.findOne(id, listId);
    return task.remove();
  }

  //* 1. Get nearest task
  //* 2. Exchange current task order with nearest task order
  // async moveUp(id: number, listId: number): Promise<void> {
  //   const task = await this.findOne(id, listId);
  //   const taskOrder = task.order;

  //   // find nearest smaller order task
  //   const query = await this.taskRepository
  //     .createQueryBuilder('task')
  //     .where('task.listId = :listId', { listId: listId })
  //     .andWhere('task.order < :order', { order: taskOrder })
  //     .orderBy(`task.order`, 'DESC')
  //     .limit(1)
  //     .getMany();

  //   // if task is uppermost/lowermost
  //   if (query.length === 0 || query === undefined) {
  //     console.log('top task');
  //     return;
  //   }

  //   const aboveTask = query[0];
  //   const aboveTaskOrder = aboveTask.order;

  //   task.order = aboveTaskOrder;
  //   aboveTask.order = taskOrder;

  //   await task.save();
  //   await aboveTask.save();
  // }

  // async moveDown(id: number, listId: number): Promise<void> {
  //   const task = await this.findOne(id, listId);
  //   const taskOrder = task.order;

  //   const query = await this.taskRepository
  //     .createQueryBuilder('task')
  //     .where('task.listId = :listId', { listId: listId })
  //     .andWhere('task.order > :order', { order: taskOrder })
  //     .orderBy(`task.order`, 'ASC')
  //     .limit(1)
  //     .getMany();

  //   // if task is uppermost/lowermost
  //   if (query.length === 0 || query === undefined) {
  //     console.log('bottom task');
  //     return;
  //   }

  //   const belowTask = query[0];
  //   const belowTaskOrder = belowTask.order;

  //   task.order = belowTaskOrder;
  //   belowTask.order = taskOrder;

  //   await task.save();
  //   await belowTask.save();
  // }
}
