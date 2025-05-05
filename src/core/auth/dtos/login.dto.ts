import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: "user@example.com", description: "User email address" })
    @IsString({ message: "Email must be a string." })
    @IsEmail({}, { message: "Incorrect email format." })
    @IsNotEmpty({ message: "Email is required." })
    email: string;

    @ApiProperty({ example: "password123", description: "User password (min 6 characters)" })
    @IsString({ message: "Password must be a string." })
    @IsNotEmpty({ message: "The password field cannot be empty." })
    @MinLength(6, { message: "Password must be at least 6 characters long." })
    password: string;

    @ApiPropertyOptional({ example: "123456", description: "Optional two-factor authentication code" })
    @IsOptional()
    @IsString()
    code: string;
}
