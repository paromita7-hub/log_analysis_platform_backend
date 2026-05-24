export const API_KEY_HEADER = "x-api-key" as const;

export interface JwtAccessTokenPayload {
  sub: string;
  organizationId: string;
  role: string;
  permissions: string[];
  sessionId: string;
  jti: string;
  iat: number;
  exp: number;
}

export interface JwtRefreshTokenPayload {
  sub: string;
  organizationId: string;
  sessionId: string;
  jti: string;
  iat: number;
  exp: number;
}

export function extractBearerToken(headerValue?: string | null): string | null {
  if (!headerValue) {
    return null;
  }

  const [scheme, token] = headerValue.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim();
}
