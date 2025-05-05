import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { LoginDto, RegisterDto, AuthResponseDto } from "../dtos";
import { AuthService } from "../services";
import { Request, Response } from "express";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { Serialize } from "@/common/decorators";
import { AuthProviderGuard } from "@/common/guards";
import { OAuthService } from "@/libs/oauth/services";
import { ConfigService } from "@nestjs/config";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly oauthService: OAuthService,
        private readonly configService: ConfigService,
    ) {}

    @Recaptcha()
    @Post("register")
    @Serialize(AuthResponseDto)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Register a new user" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "User successfully registered" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Validation or captcha error" })
    public async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Recaptcha()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @Serialize(AuthResponseDto)
    @ApiOperation({ summary: "Log in an existing user" })
    @ApiResponse({ status: HttpStatus.OK, description: "User successfully logged in" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Invalid credentials or captcha failed" })
    public async login(@Req() req: Request, @Body() dto: LoginDto) {
        return this.authService.login(req, dto);
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Log out the current user" })
    @ApiResponse({ status: HttpStatus.OK, description: "User successfully logged out" })
    public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.authService.logout(req, res);
    }

    @Get("oauth/callback/:provider")
    @UseGuards(AuthProviderGuard)
    @ApiOperation({ summary: "OAuth callback endpoint" })
    @ApiParam({ name: "provider", type: String, description: "OAuth provider name" })
    @ApiQuery({ name: "code", required: true, description: "OAuth authorization code" })
    @ApiResponse({ status: HttpStatus.FOUND, description: "Redirects to frontend dashboard after successful auth" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Missing authorization code" })
    public async callback(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Query("code") code: string, @Param("provider") provider: string) {
        if (!code) {
            throw new BadRequestException("An authorization code was not provided.");
        }

        await this.authService.extractProfileFromCode(req, provider, code);

        return res.redirect(`${this.configService.get<string>("ALLOWED_ORIGIN")}/dashboard/settings`);
    }

    @Get("oauth/connect/:provider")
    @UseGuards(AuthProviderGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get OAuth authorization URL for a provider" })
    @ApiParam({ name: "provider", type: String, description: "OAuth provider name" })
    public async connect(@Param("provider") provider: string) {
        const providerInstance = this.oauthService.findByService(provider);

        return {
            url: providerInstance.getAuthUrl(),
        };
    }
}
