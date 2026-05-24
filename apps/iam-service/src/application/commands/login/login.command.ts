export class LoginCommand {
  public constructor(
    public readonly organizationId: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}
