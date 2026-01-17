import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: "Invalid email format",
    })
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores", 
    })
    username!: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    })
    password!: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    fullName?: string;
}
