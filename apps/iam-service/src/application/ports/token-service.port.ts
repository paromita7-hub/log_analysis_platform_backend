export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenServicePort {
  createTokenPair(input: {
    userId: string;
    organizationId: string;
    role: string;
    permissions: string[];
    sessionId: string;
  }): Promise<TokenPair>;
}
