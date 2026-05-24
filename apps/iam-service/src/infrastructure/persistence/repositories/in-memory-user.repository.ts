import { Injectable } from "@nestjs/common";
import { UserAggregate } from "../../../domain/aggregates/user.aggregate";
import type { UserRepository } from "../../../domain/repositories/user.repository.interface";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserAggregate>();

  public async findByEmail(organizationId: string, email: string): Promise<UserAggregate | null> {
    for (const user of this.users.values()) {
      if (user.organizationId === organizationId && user.email === email.trim().toLowerCase()) {
        return user;
      }
    }

    return null;
  }

  public async findById(organizationId: string, userId: string): Promise<UserAggregate | null> {
    const user = this.users.get(userId) ?? null;
    if (!user || user.organizationId !== organizationId) {
      return null;
    }

    return user;
  }

  public async save(user: UserAggregate): Promise<void> {
    this.users.set(user.id, user);
  }
}
