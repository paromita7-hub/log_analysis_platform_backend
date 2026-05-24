import { InvalidEmailException } from "../exceptions/invalid-email.exception";

const emailPattern =
  /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export class Email {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!emailPattern.test(normalized)) {
      throw new InvalidEmailException(value);
    }

    this.value = normalized;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
