import { DomainException, errorCodes } from "@logpulse/shared-errors";

export class InvalidEmailException extends DomainException {
  public readonly code = errorCodes.invalidEmail;
  public readonly httpStatus = 400;

  public constructor(email: string) {
    super(`Invalid email address: ${email}`);
  }
}
