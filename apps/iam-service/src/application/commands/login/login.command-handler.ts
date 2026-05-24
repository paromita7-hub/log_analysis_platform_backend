import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import type { LoginResponse } from "@logpulse/shared-contracts";
import { LoginCommand } from "./login.command";
import type { UserRepository } from "../../../domain/repositories/user.repository.interface";
import type { TokenServicePort } from "../../ports/token-service.port";
import { TOKEN_SERVICE, USER_REPOSITORY } from "../../tokens";

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand, LoginResponse> {
  public constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenServicePort
  ) {}

  public async execute(command: LoginCommand): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(command.organizationId, command.email);
    if (!user) {
      throw new Error("User not found");
    }

    const { sessionId } = await user.login(command.password);
    await this.userRepository.save(user);

    const tokenPair = await this.tokenService.createTokenPair({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      permissions: [],
      sessionId
    });

    return {
      accessToken: tokenPair.accessToken,
      expiresIn: tokenPair.expiresIn,
      tokenType: "Bearer",
      user: {
        id: user.id,
        organizationId: user.organizationId,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: []
      }
    };
  }
}
