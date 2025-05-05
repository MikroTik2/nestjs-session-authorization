import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ConfirmationDto {
    @ApiProperty({
        description: "Confirmation token",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    @IsString({ message: "Token must be a string." })
    @IsNotEmpty({ message: "The token field cannot be empty." })
    token: string;
}
