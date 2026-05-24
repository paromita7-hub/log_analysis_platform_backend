import Redis, { type RedisOptions } from "ioredis";

export class RedisService {
  public readonly client: Redis;

  public constructor(url: string, options?: RedisOptions) {
    this.client = options ? new Redis(url, options) : new Redis(url);
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async set(key: string, value: string): Promise<"OK" | null> {
    return this.client.set(key, value);
  }

  public async setEx(key: string, ttlSeconds: number, value: string): Promise<"OK"> {
    return this.client.setex(key, ttlSeconds, value);
  }

  public async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  public async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) > 0;
  }

  public async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  public async expire(key: string, ttlSeconds: number): Promise<boolean> {
    return (await this.client.expire(key, ttlSeconds)) === 1;
  }
}

export class IdempotencyService {
  public constructor(private readonly redisService: RedisService) {}

  public async hasProcessed(key: string): Promise<boolean> {
    return this.redisService.exists(key);
  }

  public async markProcessed(key: string, ttlSeconds: number): Promise<void> {
    await this.redisService.setEx(key, ttlSeconds, "1");
  }
}
