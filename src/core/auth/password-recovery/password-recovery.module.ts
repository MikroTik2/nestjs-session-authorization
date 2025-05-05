import { Module } from "@nestjs/common";

import { UserService } from "@/core/user/services";
import { MailService } from "@/libs/mail/services";
import { PasswordRecoveryService } from "./services";
import { PasswordRecoveryController } from "./controllers";
import { PasswordService } from "@/libs/security/services";

@Module({
    controllers: [PasswordRecoveryController],
    providers: [PasswordRecoveryService, UserService, MailService, PasswordService],
})
export class PasswordRecoveryModule {}
