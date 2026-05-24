import { Injectable } from "@nestjs/common";
import { sign } from "jsonwebtoken";
import type { TokenPair, TokenServicePort } from "../../application/ports/token-service.port";

@Injectable()
export class SimpleTokenService implements TokenServicePort {
  public async createTokenPair(input: {
    userId: string;
    organizationId: string;
    role: string;
    permissions: string[];
    sessionId: string;
  }): Promise<TokenPair> {
    const secret = process.env.JWT_ACCESS_SECRET ?? "dev-secret-change-me";
    const expiresIn = 900;
    const accessToken = sign(
      {
        sub: input.userId,
        organizationId: input.organizationId,
        role: input.role,
        permissions: input.permissions,
        sessionId: input.sessionId
      },
      secret,
      { expiresIn }
    );

    const refreshToken = sign(
      {
        sub: input.userId,
        organizationId: input.organizationId,
        sessionId: input.sessionId
      },
      process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret-change-me",
      { expiresIn: "7d" }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn
    };
  }
}
