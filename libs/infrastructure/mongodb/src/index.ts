import { type Filter, type Collection, type Document, type OptionalUnlessRequiredId, ObjectId } from "mongodb";

export abstract class MongoBaseRepository<TDocument extends Document> {
  protected constructor(protected readonly collection: Collection<TDocument>) {}

  public async findById(id: string): Promise<TDocument | null> {
    return (await this.collection.findOne({ _id: new ObjectId(id) } as Filter<TDocument>)) as TDocument | null;
  }

  public async findMany(filter: Filter<TDocument>, limit: number): Promise<TDocument[]> {
    return (await this.collection.find(filter).limit(limit).toArray()) as TDocument[];
  }

  public async save(document: OptionalUnlessRequiredId<TDocument>): Promise<void> {
    await this.collection.insertOne(document);
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) } as Filter<TDocument>);
    return result.deletedCount === 1;
  }
}
