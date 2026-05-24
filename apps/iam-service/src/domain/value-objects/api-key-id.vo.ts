import { randomUUID } from "node:crypto";

export class ApiKeyId {
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public static create(): ApiKeyId {
    return new ApiKeyId(randomUUID());
  }

  public toString(): string {
    return this.value;
  }
}
