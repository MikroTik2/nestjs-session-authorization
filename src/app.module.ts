import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "@/common/env";
import { PrismaModule } from "@/libs/prisma";
import { SecurityModule } from "@/libs/security";
import { UserModule } from "@/core/user";
import { AuthModule } from "@/core/auth";
import { MailModule } from "./libs/mail";
import { EmailConfirmationModule } from "./core/auth/email-confirmation";
import { PasswordRecoveryModule } from "./core/auth/password-recovery";
import { OAutModule } from "./libs/oauth";
import { RecaptchaModule } from "./libs/recaptcha";
import { TwoFactorAuthModule } from "./libs/two-factor-auth";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
        }),

        AuthModule,
        PasswordRecoveryModule,
        EmailConfirmationModule,
        UserModule,

        PrismaModule,
        OAutModule,
        SecurityModule,
        RecaptchaModule,
        MailModule,
        TwoFactorAuthModule,
    ],
})
export class AppModule {}
