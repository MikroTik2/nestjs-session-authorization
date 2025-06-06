import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";

import { ConfirmationDto } from "../dtos";
import { PrismaService } from "@/libs/prisma/services";
import { MailService } from "@/libs/mail/services";
import { UserService } from "@/core/user/services";
import { AuthService } from "../../services";
import { TokenType } from "@prisma/client";

@Injectable()
export class EmailConfirmationService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}

    public async newVerification(req: Request, dto: ConfirmationDto) {
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token: dto.token,
                type: TokenType.VERIFICATION,
            },
        });

        if (!existingToken) {
            throw new NotFoundException("No confirmation token was found. Please make sure you have the correct token.");
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date();

        if (hasExpired) {
            throw new BadRequestException("The confirmation token has expired. Please request a new confirmation token.");
        }

        const existingUser = await this.userService.findByEmail(existingToken.email);

        if (!existingUser) {
            throw new NotFoundException("User not found. Please check the email address entered and try again.");
        }

        await this.prismaService.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                isVerified: true,
            },
        });

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.VERIFICATION,
            },
        });

        return this.authService.saveSession(req, existingUser);
    }

    public async sendVerificationToken(email: string) {
        const verificationToken = await this.generateVerificationToken(email);

        await this.mailService.sendConfirmationEmail(verificationToken.email, verificationToken.token);

        return true;
    }

    private async generateVerificationToken(email: string) {
        const token = uuidv4();
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.VERIFICATION,
            },
        });

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.VERIFICATION,
                },
            });
        }

        const verificationToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.VERIFICATION,
            },
        });

        return verificationToken;
    }
}
