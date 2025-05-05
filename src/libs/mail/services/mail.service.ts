import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/components";

import { ResetPasswordTemplate } from "../templates/reset-password.template";
import { ConfirmationTemplate } from "../templates/confirmation.template";
import { TwoFactorAuthTemplate } from "../templates/two-factor-auth.template";

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    public async sendPasswordResetEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
        const html = await render(ResetPasswordTemplate({ domain, token }));

        return this.sendMail(email, "Password reset", html);
    }

    public async sendConfirmationEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
        const html = await render(ConfirmationTemplate({ domain, token }));

        return this.sendMail(email, "Email confirmation", html);
    }

    public async sendTwoFactorTokenEmail(email: string, token: string) {
        const html = await render(TwoFactorAuthTemplate({ token }));

        return this.sendMail(email, "Confirmation of your identity", html);
    }

    private sendMail(email: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to: email,
            subject,
            html,
        });
    }
}
