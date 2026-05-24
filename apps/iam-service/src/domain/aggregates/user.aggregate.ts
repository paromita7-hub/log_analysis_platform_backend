import { randomUUID } from "node:crypto";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials.exception";
import type { UserCreatedEvent } from "../events/user-created.event";
import type { UserLoggedInEvent } from "../events/user-logged-in.event";
import { Email } from "../value-objects/email.vo";
import { PasswordHash } from "../value-objects/password-hash.vo";
import { UserId } from "../value-objects/user-id.vo";

type UserProps = {
  userId: UserId;
  organizationId: string;
  email: Email;
  passwordHash: PasswordHash;
  name: string;
  role: string;
  createdAt: Date;
  lastLoginAt: Date | null;
  isActive: boolean;
};

export class UserAggregate {
  private readonly domainEvents: Array<UserCreatedEvent | UserLoggedInEvent> = [];

  private constructor(private readonly props: UserProps) {}

  public static async register(input: {
    organizationId: string;
    email: string;
    password: string;
    name: string;
    role: string;
  }): Promise<UserAggregate> {
    const createdAt = new Date();
    const aggregate = new UserAggregate({
      userId: UserId.create(),
      organizationId: input.organizationId,
      email: new Email(input.email),
      passwordHash: await PasswordHash.fromPlainText(input.password),
      name: input.name.trim(),
      role: input.role,
      createdAt,
      lastLoginAt: null,
      isActive: true
    });

    aggregate.domainEvents.push({
      userId: aggregate.props.userId.toString(),
      organizationId: aggregate.props.organizationId,
      email: aggregate.props.email.toString(),
      name: aggregate.props.name,
      role: aggregate.props.role,
      createdAt: createdAt.toISOString()
    });

    return aggregate;
  }

  public static rehydrate(input: {
    userId: string;
    organizationId: string;
    email: string;
    passwordHash: string;
    name: string;
    role: string;
    createdAt: Date;
    lastLoginAt: Date | null;
    isActive: boolean;
  }): UserAggregate {
    return new UserAggregate({
      userId: new UserId(input.userId),
      organizationId: input.organizationId,
      email: new Email(input.email),
      passwordHash: PasswordHash.fromHash(input.passwordHash),
      name: input.name,
      role: input.role,
      createdAt: input.createdAt,
      lastLoginAt: input.lastLoginAt,
      isActive: input.isActive
    });
  }

  public async login(password: string): Promise<{ sessionId: string }> {
    if (!this.props.isActive) {
      throw new InvalidCredentialsException();
    }

    const matches = await this.props.passwordHash.verify(password);
    if (!matches) {
      throw new InvalidCredentialsException();
    }

    const sessionId = randomUUID();
    const loggedInAt = new Date();
    this.props.lastLoginAt = loggedInAt;
    this.domainEvents.push({
      userId: this.props.userId.toString(),
      organizationId: this.props.organizationId,
      sessionId,
      loggedInAt: loggedInAt.toISOString()
    });

    return { sessionId };
  }

  public pullDomainEvents(): Array<UserCreatedEvent | UserLoggedInEvent> {
    return this.domainEvents.splice(0, this.domainEvents.length);
  }

  public toPersistence(): {
    userId: string;
    organizationId: string;
    email: string;
    passwordHash: string;
    name: string;
    role: string;
    createdAt: Date;
    lastLoginAt: Date | null;
    isActive: boolean;
  } {
    return {
      userId: this.props.userId.toString(),
      organizationId: this.props.organizationId,
      email: this.props.email.toString(),
      passwordHash: this.props.passwordHash.toString(),
      name: this.props.name,
      role: this.props.role,
      createdAt: this.props.createdAt,
      lastLoginAt: this.props.lastLoginAt,
      isActive: this.props.isActive
    };
  }

  public get id(): string {
    return this.props.userId.toString();
  }

  public get organizationId(): string {
    return this.props.organizationId;
  }

  public get email(): string {
    return this.props.email.toString();
  }

  public get name(): string {
    return this.props.name;
  }

  public get role(): string {
    return this.props.role;
  }
}
