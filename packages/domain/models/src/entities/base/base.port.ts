export interface BasePort<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  upsert(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}