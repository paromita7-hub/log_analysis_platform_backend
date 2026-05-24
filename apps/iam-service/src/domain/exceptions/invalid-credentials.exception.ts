import { DomainException, errorCodes } from "@logpulse/shared-errors";

export class InvalidCredentialsException extends DomainException {
  public readonly code = errorCodes.invalidCredentials;
  public readonly httpStatus = 401;

  public constructor() {
    super("Invalid credentials");
  }
}
