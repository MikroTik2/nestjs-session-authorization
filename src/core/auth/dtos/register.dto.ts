import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsPasswordsMatchingConstraint } from "@/common/decorators/is-passwords-matching-constraint.decorator";

export class RegisterDto {
    @ApiProperty({ example: "John Doe", description: "User's full name" })
    @IsString({ message: "Name must be a string." })
    @IsNotEmpty({ message: "Name is required." })
    name: string;

    @ApiProperty({ example: "john@example.com", description: "User's email address" })
    @IsString({ message: "Email must be a string." })
    @IsEmail({}, { message: "Invalid email format." })
    @IsNotEmpty({ message: "Email is required." })
    email: string;

    @ApiProperty({ example: "securePassword", description: "Password with at least 6 characters" })
    @IsString({ message: "Password must be a string." })
    @IsNotEmpty({ message: "Password is required." })
    @MinLength(6, {
        message: "Password must be at least 6 characters long.",
    })
    password: string;

    @ApiProperty({ example: "securePassword", description: "Repeat password to confirm match" })
    @IsString({ message: "Password confirmation must be a string." })
    @IsNotEmpty({ message: "Password confirmation cannot be empty." })
    @MinLength(6, {
        message: "Password confirmation must be at least 6 characters long.",
    })
    @Validate(IsPasswordsMatchingConstraint, {
        message: "Passwords do not match.",
    })
    passwordRepeat: string;
}
