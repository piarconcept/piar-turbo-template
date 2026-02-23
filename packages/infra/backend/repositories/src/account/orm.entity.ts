import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Account' })
export class AccountOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true })
  accountCode!: string;

  @Column({ type: 'text', unique: true, nullable: true })
  email!: string;

  @Column({ type: 'text', nullable: true })
  passwordHash!: string;

  @Column({ type: 'text', nullable: true })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
