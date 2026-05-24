import { UserAggregate } from "../aggregates/user.aggregate";

export interface UserRepository {
  findByEmail(organizationId: string, email: string): Promise<UserAggregate | null>;
  findById(organizationId: string, userId: string): Promise<UserAggregate | null>;
  save(user: UserAggregate): Promise<void>;
}
