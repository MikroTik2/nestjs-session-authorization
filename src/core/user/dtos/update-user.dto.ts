import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({ example: "John Doe", description: "Full name of the user" })
    @IsString({ message: "Name must be a string." })
    @IsNotEmpty({ message: "Name is required." })
    name: string;

    @ApiProperty({ example: "john.doe@example.com", description: "User email address" })
    @IsString({ message: "Email must be a string." })
    @IsEmail({}, { message: "Invalid email format." })
    @IsNotEmpty({ message: "Email is required." })
    email: string;

    @ApiProperty({ example: true, description: "Indicates if two-factor authentication is enabled" })
    @IsBoolean({ message: "isTwoFactorEnabled must be a boolean." })
    isTwoFactorEnabled: boolean;
}
