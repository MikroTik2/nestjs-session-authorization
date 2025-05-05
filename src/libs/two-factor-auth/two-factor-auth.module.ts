import { Module } from "@nestjs/common";
import { MailService } from "../mail/services";

@Module({
    providers: [TwoFactorAuthModule, MailService],
})
export class TwoFactorAuthModule {}
