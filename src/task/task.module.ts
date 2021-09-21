import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BoardModule } from 'src/board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './entities/task.repository';
import { ListModule } from 'src/list/list.module';

@Module({
  imports: [
    AuthModule,
    BoardModule,
    ListModule,
    TypeOrmModule.forFeature([TaskRepository]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
