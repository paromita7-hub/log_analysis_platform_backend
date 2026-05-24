export abstract class DomainException extends Error {
  public abstract readonly code: string;
  public abstract readonly httpStatus: number;
  public readonly details?: unknown;

  protected constructor(message: string, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.details = details;
  }
}

export abstract class ApplicationException extends Error {
  public abstract readonly code: string;
  public abstract readonly httpStatus: number;
  public readonly details?: unknown;

  protected constructor(message: string, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.details = details;
  }
}

export const errorCodes = {
  invalidEmail: "IAM_INVALID_EMAIL",
  invalidCredentials: "IAM_INVALID_CREDENTIALS",
  tokenInvalid: "IAM_TOKEN_INVALID",
  apiKeyNotFound: "IAM_API_KEY_NOT_FOUND",
  validationFailed: "COMMON_VALIDATION_FAILED",
  logNotFound: "LOG_QUERY_LOG_NOT_FOUND",
  serviceNotFound: "SERVICE_REGISTRY_SERVICE_NOT_FOUND",
  alertRuleNotFound: "ALERTING_RULE_NOT_FOUND"
} as const;

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes];
