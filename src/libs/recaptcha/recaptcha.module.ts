import { Module } from "@nestjs/common";
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getRecaptchaConfig } from "./configs";

@Module({
    imports: [
        GoogleRecaptchaModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: getRecaptchaConfig,
            inject: [ConfigService],
        }),
    ],
})
export class RecaptchaModule {}
