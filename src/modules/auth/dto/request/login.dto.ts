import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    emailOrUsername!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    })
    password!: string;
}