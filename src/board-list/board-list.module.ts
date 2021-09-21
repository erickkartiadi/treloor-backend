import { Module } from '@nestjs/common';
import { BoardListService } from './board-list.service';
import { BoardListController } from './board-list.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardListRepository } from './entities/board-list.repository';
import { BoardModule } from 'src/board/board.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardListRepository]),
    AuthModule,
    BoardModule,
  ],
  controllers: [BoardListController],
  providers: [BoardListService],
  exports: [BoardListService],
})
export class BoardListModule {}
