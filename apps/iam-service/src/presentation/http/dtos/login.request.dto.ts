import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class LoginRequestDto {
  @IsUUID()
  public readonly organizationId!: string;

  @IsEmail()
  public readonly email!: string;

  @IsString()
  @IsNotEmpty()
  public readonly password!: string;
}
