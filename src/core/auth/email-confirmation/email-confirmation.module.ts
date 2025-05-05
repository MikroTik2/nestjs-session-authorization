import { forwardRef, Module } from "@nestjs/common";

import { MailModule } from "@/libs/mail/mail.module";

import { AuthModule } from "../auth.module";
import { EmailConfirmationController } from "./controllers";
import { EmailConfirmationService } from "./services";
import { UserService } from "@/core/user/services";
import { MailService } from "@/libs/mail/services";
import { PasswordService } from "@/libs/security/services";

@Module({
    imports: [MailModule, forwardRef(() => AuthModule)],
    controllers: [EmailConfirmationController],
    providers: [EmailConfirmationService, UserService, MailService, PasswordService],
    exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
