import { type Repository, type FindOptionsWhere, type ObjectLiteral } from "typeorm";

export abstract class PostgresBaseRepository<TEntity extends ObjectLiteral> {
  protected constructor(protected readonly repository: Repository<TEntity>) {}

  public async findById(where: FindOptionsWhere<TEntity>): Promise<TEntity | null> {
    return this.repository.findOne({ where });
  }

  public async findMany(where: FindOptionsWhere<TEntity>): Promise<TEntity[]> {
    return this.repository.find({ where });
  }

  public async save(entity: TEntity): Promise<TEntity> {
    return this.repository.save(entity);
  }

  public async delete(where: FindOptionsWhere<TEntity>): Promise<boolean> {
    const result = await this.repository.delete(where);
    return (result.affected ?? 0) > 0;
  }
}
