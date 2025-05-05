import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { ConfirmationDto } from "../dtos";
import { EmailConfirmationService } from "../services";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Email confirmation")
@Controller("auth/email-confirmation")
export class EmailConfirmationController {
    public constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    public async newVerification(@Req() req: Request, @Body() dto: ConfirmationDto) {
        return this.emailConfirmationService.newVerification(req, dto);
    }
}
