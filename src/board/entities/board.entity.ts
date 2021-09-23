import { User } from 'src/auth/entities/user.entity';
import { List } from 'src/list/entities/list.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  creatorId: number;

  @ManyToMany(() => User, (user) => user.boards)
  @JoinTable({
    name: 'board_member',
    joinColumn: {
      name: 'boardId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @OneToMany(() => List, (list) => list.board)
  list: List[];
}
