import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'DynamicPage' })
export class DynamicPageOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true })
  pageCode!: string;

  @Column({ type: 'text', unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  status?: string;

  @Column({ type: 'jsonb' })
  hero!: unknown;

  @Column({ type: 'jsonb', nullable: true })
  sections?: unknown | null;

  @Column({ type: 'jsonb', nullable: true })
  seo?: unknown | null;

  @Column({ type: 'boolean', nullable: true })
  isActive!: boolean;

  @Column({ type: 'integer', nullable: true })
  webPriority!: number;

  @Column({ type: 'boolean', nullable: true, default: false })
  showOnPublicWeb!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
