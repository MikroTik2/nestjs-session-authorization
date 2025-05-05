import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./controllers";
import { AuthService } from "./services";
import { UserService } from "../user/services";
import { PasswordService } from "@/libs/security/services";
import { RecaptchaModule } from "@/libs/recaptcha";
import { OAutModule } from "@/libs/oauth";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getOAuthConfig } from "@/libs/oauth/configs";
import { MailModule } from "@/libs/mail";
import { EmailConfirmationModule } from "./email-confirmation";
import { TwoFactorAuthService } from "@/libs/two-factor-auth/services";

@Module({
    imports: [
        RecaptchaModule,
        MailModule,
        OAutModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getOAuthConfig,
            inject: [ConfigService],
        }),
        forwardRef(() => EmailConfirmationModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, PasswordService, TwoFactorAuthService],
    exports: [AuthService],
})
export class AuthModule {}
