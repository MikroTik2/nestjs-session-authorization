import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty({
        description: "User's registered email address for password reset",
        example: "john.doe@example.com",
    })
    @IsEmail({}, { message: "Please provide a valid email address." })
    @IsNotEmpty({ message: "Email address is required." })
    @MaxLength(254, { message: "Email address cannot be longer than 254 characters." })
    email: string;
}
