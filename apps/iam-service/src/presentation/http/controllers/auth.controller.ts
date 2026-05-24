import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import type { LoginResponse } from "@logpulse/shared-contracts";
import { LoginCommand } from "../../../application/commands/login/login.command";
import { LoginRequestDto } from "../dtos/login.request.dto";

@Controller("auth")
export class AuthController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Post("login")
  public async login(@Body() body: LoginRequestDto): Promise<LoginResponse> {
    return this.commandBus.execute(
      new LoginCommand(body.organizationId, body.email, body.password)
    );
  }
}
