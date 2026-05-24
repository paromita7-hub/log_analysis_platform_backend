import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { LoginCommandHandler } from "../application/commands/login/login.command-handler";
import { AuthController } from "../presentation/http/controllers/auth.controller";
import { TOKEN_SERVICE, USER_REPOSITORY } from "../application/tokens";
import { InMemoryUserRepository } from "../infrastructure/persistence/repositories/in-memory-user.repository";
import { SimpleTokenService } from "../infrastructure/services/simple-token.service";

@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [
    LoginCommandHandler,
    InMemoryUserRepository,
    SimpleTokenService,
    {
      provide: USER_REPOSITORY,
      useExisting: InMemoryUserRepository
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: SimpleTokenService
    }
  ],
})
export class AppModule {}
