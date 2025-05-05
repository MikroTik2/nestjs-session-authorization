import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class NewPasswordDto {
    @ApiProperty({
        description: "The new password for the user account",
        example: "SecurePassword123!",
        minLength: 8,
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    })
    @IsString({ message: "Password must be a string." })
    @MinLength(8, { message: "Password must be at least 8 characters long." })
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    })
    @IsNotEmpty({ message: "Password cannot be empty." })
    password: string;
}
