import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ContactSubmission' })
export class ContactSubmissionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  email!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'boolean', default: false })
  consent!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  lastPages?: string[] | null;

  @Column({ type: 'text', nullable: true })
  locale?: string | null;

  @Column({ type: 'text', nullable: true })
  source?: string | null;

  @Column({ type: 'text', default: 'new' })
  status!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, string> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
