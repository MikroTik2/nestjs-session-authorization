import { Body, Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { PasswordRecoveryService } from "../services";
import { NewPasswordDto, ResetPasswordDto } from "../dtos";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Password recovery")
@Controller("auth/password-recovery")
export class PasswordRecoveryController {
    public constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {}

    @Recaptcha()
    @Post("reset")
    @HttpCode(HttpStatus.OK)
    public async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.passwordRecoveryService.reset(dto);
    }

    @Recaptcha()
    @Post("new/:token")
    @HttpCode(HttpStatus.OK)
    public async newPassword(@Body() dto: NewPasswordDto, @Param("token") token: string) {
        return this.passwordRecoveryService.new(dto, token);
    }
}
