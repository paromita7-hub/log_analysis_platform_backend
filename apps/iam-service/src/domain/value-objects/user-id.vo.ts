import { randomUUID } from "node:crypto";

export class UserId {
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public static create(): UserId {
    return new UserId(randomUUID());
  }

  public toString(): string {
    return this.value;
  }
}
