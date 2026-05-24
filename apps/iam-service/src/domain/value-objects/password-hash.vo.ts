import * as argon2 from "argon2";

export class PasswordHash {
  private constructor(private readonly hash: string) {}

  public static async fromPlainText(plainText: string): Promise<PasswordHash> {
    const hash = await argon2.hash(plainText);
    return new PasswordHash(hash);
  }

  public static fromHash(hash: string): PasswordHash {
    return new PasswordHash(hash);
  }

  public async verify(plainText: string): Promise<boolean> {
    return argon2.verify(this.hash, plainText);
  }

  public toString(): string {
    return this.hash;
  }
}
