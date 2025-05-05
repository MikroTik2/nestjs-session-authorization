import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LoginDto, RegisterDto } from "../dtos";
import { UserService } from "@/core/user/services";
import { AuthMethod, User } from "@prisma/client";
import { Request, Response } from "express";
import { PasswordService } from "@/libs/security/services";
import { ConfigService } from "@nestjs/config";
import { OAuthService } from "@/libs/oauth/services";
import { PrismaService } from "@/libs/prisma/services";
import { EmailConfirmationService } from "../email-confirmation/services";
import { TwoFactorAuthService } from "@/libs/two-factor-auth/services";

@Injectable()
export class AuthService {
    public constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly configService: ConfigService,
        private readonly oauthService: OAuthService,
        private readonly prisma: PrismaService,
        private readonly twoFactorAuthService: TwoFactorAuthService,
        private readonly emailConfirmationService: EmailConfirmationService,
    ) {}

    public async register(dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email);

        if (isExists) {
            throw new ConflictException("Registration failed. A user with this email already exists. Please use a different email address or log in to your account.");
        }

        const newUser = await this.userService.create(dto.email, dto.password, dto.name, "", AuthMethod.CREDENTIALS, false);

        await this.emailConfirmationService.sendVerificationToken(newUser.email);

        return {
            message: "You have successfully registered. Please confirm your email. A message has been sent to your mailing address.",
        };
    }

    public async login(req: Request, dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);

        if (!user || !user.password) {
            throw new NotFoundException("User not found. Please check the entered data");
        }

        const isValidPassword = await this.passwordService.scryptVerify(dto.password, user.password);

        if (!isValidPassword) {
            throw new UnauthorizedException("Invalid password. Please try again or reset your password if you have forgotten it.");
        }

        if (!user.isVerified) {
            await this.emailConfirmationService.sendVerificationToken(user.email);
            throw new UnauthorizedException("Your email has not been confirmed. Please check your email and confirm your address.");
        }

        if (user.isTwoFactorEnabled) {
            if (!dto.code) {
                await this.twoFactorAuthService.sendTwoFactorToken(user.email);

                return {
                    message: "Check your email. Two-factor authentication code required.",
                };
            }

            await this.twoFactorAuthService.validateTwoFactorToken(user.email, dto.code);
        }

        return this.saveSession(req, user);
    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            "Failed to terminate the session. There may have been a problem with the server or the session may have already been terminated.",
                        ),
                    );
                }
                res.clearCookie(this.configService.get<string>("SESSION_NAME"));
                resolve();
            });
        });
    }

    public async extractProfileFromCode(req: Request, provider: string, code: string) {
        const providerInstance = this.oauthService.findByService(provider);
        const profile = await providerInstance.findUserByCode(code);

        const account = await this.prisma.account.findFirst({
            where: {
                id: profile.id,
                provider: profile.provider,
            },
        });

        let user = account?.userId ? await this.userService.findById(account.userId) : null;

        if (user) {
            return this.saveSession(req, user);
        }

        user = await this.userService.create(profile.email, "", profile.name, profile.picture, AuthMethod[profile.provider.toUpperCase()], true);

        if (!account) {
            await this.prisma.account.create({
                data: {
                    userId: user.id,
                    type: "oauth",
                    provider: profile.provider,
                    accessToken: profile.access_token,
                    refreshToken: profile.refresh_token,
                    expiresAt: profile.expires_at,
                },
            });
        }

        return this.saveSession(req, user);
    }

    public async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id;
            req.session.save(err => {
                if (err) {
                    return reject(new InternalServerErrorException("Session save failed. Ensure that session parameters are properly configured."));
                }

                resolve({ user });
            });
        });
    }
}
