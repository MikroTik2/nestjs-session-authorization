import { ConfigService } from "@nestjs/config";
import { GoogleRecaptchaModuleOptions } from "@nestlab/google-recaptcha";

export const getRecaptchaConfig = async (configService: ConfigService): Promise<GoogleRecaptchaModuleOptions> => ({
    secretKey: configService.get<string>("GOOGLE_RECAPTCHA_SECRET_KEY"),
    response: req => req.headers.recaptcha,
    skipIf: true,
});
